import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Oficina {
  oficina: string;
  sigla: string;
}

interface Respuesta_oficinas {
  success: boolean;
  oficinas: Oficina[];
  message?: string;
}

@Component({
  selector: 'app-mesa-partes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mesa-partes.html',
  styleUrl: './mesa-partes.css',
})
export class MesaPartes implements OnInit {
  private http = inject(HttpClient);

  private script_url: string =
    'https://script.google.com/macros/s/AKfycbxFK2vy64L8hpCf8OT0iPKs0R4EKok3t-JrNxy-A1jJysqtt_O4rLjibAHnt5zIpFZJ4A/exec';

  oficinas: Oficina[] = [];

  nombre: string = '';
  tipo_doc: string = '';
  num_doc: string = '';
  email: string = '';
  telefono: string = '';
  destinatario: string = '';
  asunto: string = '';
  link_pdf: string = '';
  acepto_terminos: boolean = false;

  archivo_pdf: File | null = null;
  nombre_archivo: string = 'No se ha seleccionado ningún archivo';

  enviando: boolean = false;
  cargando_oficinas: boolean = false;
  solicitud_enviada: boolean = false;

  exito: boolean = false;
  error: boolean = false;
  mensaje: string = '';

  ngOnInit(): void {
    this.cargar_oficinas();
  }

  get asunto_largo(): number {
    return this.asunto.length;
  }

  cargar_oficinas(): void {
    this.cargando_oficinas = true;

    this.http
      .get<Respuesta_oficinas>(`${this.script_url}?action=getOficinas`)
      .subscribe({
        next: (respuesta: Respuesta_oficinas) => {
          this.oficinas = respuesta.oficinas ?? [];
          this.cargando_oficinas = false;
        },
        error: () => {
          this.oficinas = [];
          this.cargando_oficinas = false;
        },
      });
  }

  seleccionar_pdf(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const archivo: File | null = input.files?.[0] ?? null;

    if (!archivo) {
      this.archivo_pdf = null;
      this.nombre_archivo = 'No se ha seleccionado ningún archivo';
      return;
    }

    if (archivo.type !== 'application/pdf') {
      this.archivo_pdf = null;
      this.nombre_archivo = 'Archivo inválido';
      this.mostrar_error('Solo se permite subir archivos PDF.');
      input.value = '';
      return;
    }

    const limite_mb: number = 20;
    const peso_mb: number = archivo.size / (1024 * 1024);

    if (peso_mb > limite_mb) {
      this.archivo_pdf = null;
      this.nombre_archivo = 'Archivo excede 20 MB';
      this.mostrar_error(
        'El archivo supera los 20 MB. Súbelo a Drive o OneDrive y coloca el enlace.'
      );
      input.value = '';
      return;
    }

    this.archivo_pdf = archivo;
    this.nombre_archivo = archivo.name;
    this.error = false;
  }

  async enviar_formulario(): Promise<void> {
    if (this.enviando || this.solicitud_enviada) return;
    if (!this.validar_formulario()) return;

    this.enviando = true;
    this.exito = false;
    this.error = false;
    this.mensaje = 'Enviando solicitud... por favor espere unos segundos.';

    try {
      const form_data: FormData = new FormData();

      form_data.append('action', 'submitMesa');
      form_data.append('nombre', this.nombre.trim());
      form_data.append('tipo_doc', this.tipo_doc);
      form_data.append('num_doc', this.num_doc.trim());
      form_data.append('email', this.email.trim());
      form_data.append('telefono', this.telefono.trim());
      form_data.append('destinatario', this.destinatario);
      form_data.append('asunto', this.asunto.trim());
      form_data.append('link_pdf', this.link_pdf.trim());

      if (this.archivo_pdf) {
        const pdf_base64: string = await this.archivo_base64(this.archivo_pdf);
        form_data.append('pdf_base64', pdf_base64);
        form_data.append('pdf_filename', this.archivo_pdf.name);
      }

      const envio_real: Promise<Response> = fetch(this.script_url, {
        method: 'POST',
        body: form_data,
        mode: 'no-cors',
      });

      await Promise.race([
        envio_real,
        this.esperar(6000),
      ]);

      this.enviando = false;
      this.exito = true;
      this.error = false;
      this.solicitud_enviada = true;
      this.mensaje =
        'Su solicitud fue enviada correctamente. Revise su correo para confirmar la recepción. No la envíe nuevamente para evitar duplicados.';
      this.limpiar_formulario();
    } catch {
      this.enviando = false;
      this.mostrar_error(
        'No se pudo completar el envío. Intente nuevamente en unos segundos.'
      );
    }
  }

  nueva_solicitud(): void {
    this.exito = false;
    this.error = false;
    this.mensaje = '';
    this.solicitud_enviada = false;
  }

  private validar_formulario(): boolean {
    if (!this.nombre.trim()) {
      this.mostrar_error('Ingrese su nombre y apellidos.');
      return false;
    }

    if (!this.tipo_doc) {
      this.mostrar_error('Seleccione el tipo de documento.');
      return false;
    }

    if (!this.num_doc.trim()) {
      this.mostrar_error('Ingrese el número de documento.');
      return false;
    }

    if (!this.email.trim()) {
      this.mostrar_error('Ingrese el correo electrónico.');
      return false;
    }

    if (!this.destinatario) {
      this.mostrar_error('Seleccione el destinatario.');
      return false;
    }

    if (!this.asunto.trim()) {
      this.mostrar_error('Ingrese el asunto.');
      return false;
    }

    if (!this.archivo_pdf && !this.link_pdf.trim()) {
      this.mostrar_error(
        'Debe adjuntar un PDF o colocar un enlace en la nube.'
      );
      return false;
    }

    if (!this.acepto_terminos) {
      this.mostrar_error('Debe aceptar los términos y condiciones.');
      return false;
    }

    return true;
  }

  private mostrar_error(mensaje: string): void {
    this.exito = false;
    this.error = true;
    this.mensaje = mensaje;
  }

  private limpiar_formulario(): void {
    this.nombre = '';
    this.tipo_doc = '';
    this.num_doc = '';
    this.email = '';
    this.telefono = '';
    this.destinatario = '';
    this.asunto = '';
    this.link_pdf = '';
    this.acepto_terminos = false;
    this.archivo_pdf = null;
    this.nombre_archivo = 'No se ha seleccionado ningún archivo';
  }

  private archivo_base64(archivo: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const lector = new FileReader();

      lector.onload = () => {
        const resultado = lector.result;

        if (typeof resultado !== 'string') {
          reject(new Error('No se pudo leer el archivo.'));
          return;
        }

        const partes = resultado.split(',');
        const base64 = partes[1];

        if (!base64) {
          reject(new Error('No se pudo convertir el archivo.'));
          return;
        }

        resolve(base64);
      };

      lector.onerror = () => reject(new Error('Error leyendo archivo.'));
      lector.readAsDataURL(archivo);
    });
  }

  private esperar(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), ms);
    });
  }
}