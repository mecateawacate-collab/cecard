import { Component } from '@angular/core';

type TipoPersona = 'natural' | 'juridica' | 'anonima';

interface ArchivoSeleccionado {
  nombre: string;
  size: number;
  type: string;
  file: File;
  valido: boolean;
  mensaje: string;
}

@Component({
  selector: 'app-canal-denuncia',
  imports: [],
  templateUrl: './canal-denuncia.html',
  styleUrl: './canal-denuncia.css',
})
export class CanalDenuncia {
  tipoPersona: TipoPersona = 'natural';
  progreso = 0;
  archivoSobreZona = false;
  archivos: ArchivoSeleccionado[] = [];

  private readonly endpoint =
    'https://script.google.com/macros/s/AKfycbxZ0pvLvJi1FY2Ph-GlfpYJOUHtSAoytuivfeTlbR1riGFPolGk7Ak42VFTA7XCsL-C/exec';

  seleccionarTipo(tipo: TipoPersona, form: HTMLFormElement): void {
    this.tipoPersona = tipo;

    setTimeout(() => {
      this.actualizarProgreso(form);
    });
  }

  actualizarProgreso(form: HTMLFormElement): void {
    const campos = Array.from(
      form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        'input[required], select[required], textarea[required]'
      )
    ).filter((campo) => !campo.disabled && campo.type !== 'hidden');

    const completados = campos.filter((campo) => {
      if (campo instanceof HTMLInputElement && campo.type === 'checkbox') {
        return campo.checked;
      }

      return campo.value.trim() !== '';
    }).length;

    this.progreso = campos.length > 0
      ? Math.round((completados / campos.length) * 100)
      : 0;
  }

  activarZonaArchivo(event: DragEvent): void {
    event.preventDefault();
    this.archivoSobreZona = true;
  }

  desactivarZonaArchivo(): void {
    this.archivoSobreZona = false;
  }

  soltarArchivos(event: DragEvent): void {
    event.preventDefault();
    this.archivoSobreZona = false;

    const files = event.dataTransfer?.files;

    if (files) {
      this.procesarArchivos(files);
    }
  }

  seleccionarArchivos(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      this.procesarArchivos(input.files);
    }
  }

  procesarArchivos(files: FileList): void {
    const maxSize = 5 * 1024 * 1024;
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/gif'];

    this.archivos = Array.from(files).map((file) => {
      if (file.size > maxSize) {
        return {
          nombre: file.name,
          size: file.size,
          type: file.type,
          file,
          valido: false,
          mensaje: 'Archivo demasiado grande. Máximo 5 MB',
        };
      }

      if (!validTypes.includes(file.type)) {
        return {
          nombre: file.name,
          size: file.size,
          type: file.type,
          file,
          valido: false,
          mensaje: 'Tipo de archivo no permitido',
        };
      }

      return {
        nombre: file.name,
        size: file.size,
        type: file.type,
        file,
        valido: true,
        mensaje: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      };
    });
  }

  eliminarArchivo(nombre: string): void {
    this.archivos = this.archivos.filter((archivo) => archivo.nombre !== nombre);
  }

  limpiarFormulario(): void {
    setTimeout(() => {
      this.progreso = 0;
      this.archivos = [];
      this.tipoPersona = 'natural';
    });
  }

  async enviarDenuncia(event: SubmitEvent, form: HTMLFormElement): Promise<void> {
    event.preventDefault();

    const archivoValido = this.archivos.find((archivo) => archivo.valido);

    if (!archivoValido) {
      alert('Debe adjuntar al menos un archivo válido.');
      return;
    }

    const formData = new FormData(form);
    formData.set('tipo_persona', this.tipoPersona);

    const base64 = await this.convertirArchivoABase64(archivoValido.file);

    formData.set('pdf_base64', base64);
    formData.set('pdf_filename', archivoValido.nombre);

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert('¡Denuncia enviada correctamente!');
        form.reset();
        this.limpiarFormulario();
        return;
      }

      throw new Error(result.message || 'Ocurrió un error al enviar la denuncia');
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'Ocurrió un error inesperado';

      alert(`Error al enviar: ${message}`);
    }
  }

  private convertirArchivoABase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result?.toString() || '';
        const base64 = result.split(',')[1] || '';
        resolve(base64);
      };

      reader.onerror = () => {
        reject(new Error('No se pudo leer el archivo adjunto'));
      };

      reader.readAsDataURL(file);
    });
  }
}