import { Component, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { jsPDF } from 'jspdf';

interface Oficina {
  oficina: string;
  sigla: string;
}

interface RespuestaOficinas {
  success: boolean;
  oficinas: Oficina[];
  message?: string;
}

@Component({
  selector: 'app-mesa-partes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './mesa-partes.html',
  styleUrl: './mesa-partes.css',
})
export class MesaPartes implements OnInit {
  private http = inject(HttpClient);

  @ViewChild('pdf_input') pdf_input?: ElementRef<HTMLInputElement>;

  private script_url =
    'https://script.google.com/macros/s/AKfycbxDdrCibyRDvJAKaDAP54KhFSoMxot6SyN3Srt_dY7N7ZSCgTONcrToacj1ViOjqWGfEw/exec';

  oficinas = signal<Oficina[]>([]);

  nombre = signal('');
  tipo_doc = signal('');
  num_doc = signal('');
  email = signal('');
  telefono = signal('');
  destinatario = signal('');
  asunto = signal('');
  link_pdf = signal('');
  acepto_terminos = signal(false);

  archivo_pdf = signal<File | null>(null);
  nombre_archivo = signal('No se ha seleccionado ningún archivo');

  enviando = signal(false);
  cargando_oficinas = signal(false);
  solicitud_enviada = signal(false);

  exito = signal(false);
  error = signal(false);
  mensaje = signal('');

  modal_carga = signal(false);
  progreso_carga = signal(0);

  codigo_generado = signal('');
  fecha_generada = signal('');

  nombre_constancia = signal('');
  tipo_doc_constancia = signal('');
  num_doc_constancia = signal('');
  email_constancia = signal('');
  telefono_constancia = signal('');
  destinatario_constancia = signal('');
  asunto_constancia = signal('');

  ngOnInit(): void {
    this.cargar_oficinas();
  }

  get asunto_largo(): number {
    return this.asunto().length;
  }

  cargar_oficinas(): void {
    this.cargando_oficinas.set(true);

    this.http
      .get<RespuestaOficinas>(
        `${this.script_url}?action=getOficinas&_=${Date.now()}`
      )
      .subscribe({
        next: (respuesta) => {
          this.oficinas.set(respuesta.oficinas ?? []);
          this.cargando_oficinas.set(false);
        },
        error: () => {
          this.oficinas.set([]);
          this.cargando_oficinas.set(false);
          this.mostrar_error('No se pudieron cargar las oficinas.');
        },
      });
  }

  seleccionar_pdf(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0] ?? null;

    if (!archivo) {
      this.archivo_pdf.set(null);
      this.nombre_archivo.set('No se ha seleccionado ningún archivo');
      return;
    }

    if (archivo.type !== 'application/pdf') {
      this.archivo_pdf.set(null);
      this.nombre_archivo.set('Archivo inválido');
      this.mostrar_error('Solo se permite subir archivos PDF.');
      input.value = '';
      return;
    }

    const limite_mb = 20;
    const peso_mb = archivo.size / (1024 * 1024);

    if (peso_mb > limite_mb) {
      this.archivo_pdf.set(null);
      this.nombre_archivo.set('Archivo excede 20 MB');
      this.mostrar_error(
        'El archivo supera los 20 MB. Súbelo a Drive o OneDrive y coloca el enlace.'
      );
      input.value = '';
      return;
    }

    this.archivo_pdf.set(archivo);
    this.nombre_archivo.set(archivo.name);
    this.error.set(false);
    this.mensaje.set('');
  }

  async enviar_formulario(): Promise<void> {
    if (this.enviando() || this.solicitud_enviada()) return;
    if (!this.validar_formulario()) return;

    this.enviando.set(true);
    this.exito.set(false);
    this.error.set(false);
    this.modal_carga.set(true);
    this.progreso_carga.set(0);
    this.mensaje.set('Enviando solicitud... por favor espere unos segundos.');

    try {
      const codigo = this.generar_codigo_local(this.destinatario());
      const fecha = this.formatear_fecha_local(new Date());

      this.codigo_generado.set(codigo);
      this.fecha_generada.set(fecha);

      this.nombre_constancia.set(this.nombre().trim());
      this.tipo_doc_constancia.set(this.tipo_doc());
      this.num_doc_constancia.set(this.num_doc().trim());
      this.email_constancia.set(this.email().trim());
      this.telefono_constancia.set(this.telefono().trim());
      this.destinatario_constancia.set(this.destinatario());
      this.asunto_constancia.set(this.asunto().trim());

      const form_data = new FormData();

      form_data.append('action', 'submitMesa');
      form_data.append('codigo', codigo);
      form_data.append('nombre', this.nombre().trim());
      form_data.append('tipo_doc', this.tipo_doc());
      form_data.append('num_doc', this.num_doc().trim());
      form_data.append('email', this.email().trim());
      form_data.append('telefono', this.telefono().trim());
      form_data.append('destinatario', this.destinatario());
      form_data.append('asunto', this.asunto().trim());
      form_data.append('link_pdf', this.link_pdf().trim());

      const archivo = this.archivo_pdf();

      if (archivo) {
        const pdf_base64 = await this.archivo_base64(archivo);
        form_data.append('pdf_base64', pdf_base64);
        form_data.append('pdf_filename', archivo.name);
      }

      const envio_real = this.fetch_con_timeout(
        this.script_url,
        {
          method: 'POST',
          body: form_data,
          mode: 'no-cors',
        },
        60000
      );

      await this.animar_carga_mientras(envio_real);

      this.enviando.set(false);
      this.exito.set(true);
      this.error.set(false);
      this.solicitud_enviada.set(true);
      this.modal_carga.set(false);
      this.progreso_carga.set(100);

      this.mensaje.set(
        'Su solicitud fue enviada correctamente. Revise su correo para confirmar la recepción. No la envíe nuevamente para evitar duplicados.'
      );

      this.limpiar_formulario();
    } catch {
      this.enviando.set(false);
      this.modal_carga.set(false);
      this.mostrar_error(
        'No se pudo completar el envío. Intente nuevamente en unos segundos.'
      );
    }
  }

  nueva_solicitud(): void {
    this.exito.set(false);
    this.error.set(false);
    this.mensaje.set('');
    this.solicitud_enviada.set(false);
    this.modal_carga.set(false);
    this.progreso_carga.set(0);

    this.codigo_generado.set('');
    this.fecha_generada.set('');

    this.nombre_constancia.set('');
    this.tipo_doc_constancia.set('');
    this.num_doc_constancia.set('');
    this.email_constancia.set('');
    this.telefono_constancia.set('');
    this.destinatario_constancia.set('');
    this.asunto_constancia.set('');

    this.limpiar_formulario();
  }


  cerrar_modal_exito(): void {
    this.exito.set(false);
  }

  async descargar_constancia_pdf(): Promise<void> {
    if (!this.codigo_generado() || !this.fecha_generada()) return;

    try {
      const logo = await this.cargar_logo_pdf();

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const ancho_pagina = doc.internal.pageSize.getWidth();
      const alto_pagina = doc.internal.pageSize.getHeight();

      // Marca de agua centrada detrás del texto, con 25% de opacidad.
      const marca_ancho = 115;
      const marca_alto = marca_ancho / logo.proporcion;
      const marca_x = (ancho_pagina - marca_ancho) / 2;
      const marca_y = (alto_pagina - marca_alto) / 2;

      doc.addImage(
        logo.marca_agua,
        'PNG',
        marca_x,
        marca_y,
        marca_ancho,
        marca_alto
      );

      // Logo superior izquierdo.
      const logo_ancho = 28;
      const logo_alto = logo_ancho / logo.proporcion;

      doc.addImage(logo.normal, 'PNG', 20, 6, logo_ancho, logo_alto);

      doc.setDrawColor(120, 140, 170);
      doc.setLineWidth(0.4);
      doc.line(20, 30, ancho_pagina - 20, 30);

      doc.setTextColor(44, 76, 122);
      doc.setFont('times', 'bold');
      doc.setFontSize(11);
      doc.text(
        '¡Resolviendo conflictos para una cultura de paz!',
        ancho_pagina / 2,
        alto_pagina - 20,
        { align: 'center' }
      );

      doc.setFont('times', 'normal');
      doc.setFontSize(8.5);
      doc.text(
        'Jr. 28 de julio Nro. 736 - 2do. Piso (Alameda Valdelirios) - Huamanga – Ayacucho / Telf. 963 810 265',
        ancho_pagina / 2,
        alto_pagina - 14,
        { align: 'center' }
      );

      doc.text(
        'informes@cecard.org / www.cecard.org',
        ancho_pagina / 2,
        alto_pagina - 8,
        { align: 'center' }
      );

      doc.setDrawColor(120, 140, 170);
      doc.setLineWidth(0.4);
      doc.line(35, alto_pagina - 24, ancho_pagina - 35, alto_pagina - 24);

      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Constancia de envío', ancho_pagina / 2, 48, {
        align: 'center',
      });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);

      let y = 62;
      const salto = 10;

      doc.text(`Código: ${this.codigo_generado()}`, 20, y);
      y += salto;

      doc.text(`Fecha: ${this.fecha_generada()}`, 20, y);
      y += salto;

      doc.text(`Solicitante: ${this.nombre_constancia()}`, 20, y);
      y += salto;

      doc.text(
        `Documento: ${this.tipo_doc_constancia()} - ${this.num_doc_constancia()}`,
        20,
        y
      );
      y += salto;

      doc.text(`Correo: ${this.email_constancia()}`, 20, y);
      y += salto;

      doc.text(`Teléfono: ${this.telefono_constancia() || '-'}`, 20, y);
      y += salto;

      doc.text(`Destinatario: ${this.destinatario_constancia()}`, 20, y);
      y += salto;

      const asunto_lineas = doc.splitTextToSize(
        `Asunto: ${this.asunto_constancia()}`,
        170
      ) as string[];

      doc.text(asunto_lineas, 20, y);
      y += asunto_lineas.length * 7 + 8;

      doc.text(
        'Conserve este documento como cargo de envío y seguimiento.',
        20,
        y
      );

      doc.save(`constancia_${this.codigo_generado()}.pdf`);
    } catch {
      this.mostrar_error('No se pudo generar el PDF con el logo. Verifique que logo_pdf.png esté dentro de la carpeta public.');
    }
  }

  private async cargar_logo_pdf(): Promise<{
    normal: string;
    marca_agua: string;
    proporcion: number;
  }> {
    const logo_url = new URL('logo_pdf.png', document.baseURI).toString();
    const respuesta = await fetch(logo_url);

    if (!respuesta.ok) {
      throw new Error('No se encontró logo_pdf.png.');
    }

    const blob = await respuesta.blob();
    const normal = await this.blob_a_data_url(blob);
    const imagen = await this.cargar_imagen(normal);

    const ancho = imagen.naturalWidth || imagen.width;
    const alto = imagen.naturalHeight || imagen.height;

    const canvas = document.createElement('canvas');
    canvas.width = ancho;
    canvas.height = alto;

    const contexto = canvas.getContext('2d');

    if (!contexto) {
      throw new Error('No se pudo preparar la marca de agua.');
    }

    contexto.clearRect(0, 0, ancho, alto);
    contexto.globalAlpha = 0.25;
    contexto.drawImage(imagen, 0, 0, ancho, alto);

    return {
      normal,
      marca_agua: canvas.toDataURL('image/png'),
      proporcion: ancho / alto,
    };
  }

  private blob_a_data_url(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const lector = new FileReader();

      lector.onload = () => {
        if (typeof lector.result === 'string') {
          resolve(lector.result);
          return;
        }

        reject(new Error('No se pudo convertir el logo.'));
      };

      lector.onerror = () => reject(new Error('No se pudo leer el logo.'));
      lector.readAsDataURL(blob);
    });
  }

  private cargar_imagen(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const imagen = new Image();
      imagen.onload = () => resolve(imagen);
      imagen.onerror = () => reject(new Error('No se pudo cargar el logo.'));
      imagen.src = src;
    });
  }

  private validar_formulario(): boolean {
    if (!this.nombre().trim()) {
      this.mostrar_error('Ingrese su nombre y apellidos.');
      return false;
    }

    if (!this.tipo_doc()) {
      this.mostrar_error('Seleccione el tipo de documento.');
      return false;
    }

    if (!this.num_doc().trim()) {
      this.mostrar_error('Ingrese el número de documento.');
      return false;
    }

    if (!this.email().trim()) {
      this.mostrar_error('Ingrese el correo electrónico.');
      return false;
    }

    if (!this.email().includes('@')) {
      this.mostrar_error('Ingrese un correo electrónico válido.');
      return false;
    }

    if (!this.destinatario()) {
      this.mostrar_error('Seleccione el destinatario.');
      return false;
    }

    if (!this.asunto().trim()) {
      this.mostrar_error('Ingrese el asunto.');
      return false;
    }

    if (!this.archivo_pdf() && !this.link_pdf().trim()) {
      this.mostrar_error(
        'Debe adjuntar un PDF o colocar un enlace en la nube.'
      );
      return false;
    }

    if (!this.acepto_terminos()) {
      this.mostrar_error('Debe aceptar los términos y condiciones.');
      return false;
    }

    return true;
  }

  private mostrar_error(mensaje: string): void {
    this.exito.set(false);
    this.error.set(true);
    this.mensaje.set(mensaje);
  }

  private limpiar_formulario(): void {
    this.nombre.set('');
    this.tipo_doc.set('');
    this.num_doc.set('');
    this.email.set('');
    this.telefono.set('');
    this.destinatario.set('');
    this.asunto.set('');
    this.link_pdf.set('');
    this.acepto_terminos.set(false);

    this.archivo_pdf.set(null);
    this.nombre_archivo.set('No se ha seleccionado ningún archivo');

    if (this.pdf_input) {
      this.pdf_input.nativeElement.value = '';
    }
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
      lector.onabort = () => reject(new Error('Lectura cancelada.'));

      lector.readAsDataURL(archivo);
    });
  }

  private generar_codigo_local(destinatario: string): string {
    const fecha = new Date();
    const anio = fecha.getFullYear().toString().slice(-2);
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');

    const oficina = this.oficinas().find(
      (item) => item.oficina === destinatario
    );

    const sigla = oficina?.sigla?.trim() || 'GEN';

    const aleatorio = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    return `${sigla}${anio}${mes}${dia}-${aleatorio}`;
  }

  private formatear_fecha_local(fecha: Date): string {
    return fecha.toLocaleString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  private async animar_carga_mientras(promesa: Promise<unknown>): Promise<void> {
    let terminado = false;

    promesa
      .then(() => {
        terminado = true;
      })
      .catch(() => {
        terminado = true;
      });

    this.progreso_carga.set(0);

    while (!terminado && this.progreso_carga() < 90) {
      await this.esperar(120);

      const actual = this.progreso_carga();
      let nuevo = actual;

      if (actual < 60) {
        nuevo += Math.floor(Math.random() * 10) + 5;
      } else if (actual < 80) {
        nuevo += Math.floor(Math.random() * 5) + 2;
      } else {
        nuevo += 1;
      }

      this.progreso_carga.set(Math.min(nuevo, 90));
    }

    await promesa;

    while (this.progreso_carga() < 100) {
      await this.esperar(50);
      this.progreso_carga.set(Math.min(this.progreso_carga() + 5, 100));
    }

    await this.esperar(300);
  }

  private fetch_con_timeout(
    url: string,
    opciones: RequestInit,
    tiempo_ms: number
  ): Promise<Response> {
    const controller = new AbortController();

    const timeout_id = window.setTimeout(() => {
      controller.abort();
    }, tiempo_ms);

    return fetch(url, {
      ...opciones,
      signal: controller.signal,
    }).finally(() => {
      window.clearTimeout(timeout_id);
    });
  }

  private esperar(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), ms);
    });
  }
}