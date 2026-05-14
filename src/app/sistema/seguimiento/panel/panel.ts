import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, finalize, firstValueFrom, of, timeout } from 'rxjs';
import { jsPDF } from 'jspdf';

interface ExpedienteActual {
  success: boolean;
  expediente: string | number;
  anio: string | number;
  tipo: string;
  demandante: string;
  demandado: string;
  estado: string;
  tribunal?: string;
  id_expediente?: string | number;
}

type EstadoRegistro = 'Procesado' | 'Revision' | 'Pendiente' | string;

interface RegistroExpediente {
  fechaEnvio: string;
  expediente: string | number;
  anio: string | number;
  tipo: string;
  parte: string;
  destinatario: string;
  materia: string;
  sumilla: string;
  pdf?: string;
  word?: string;
  anexo?: string;
  links?: string;
  estado?: EstadoRegistro;
  puedeAbrir?: boolean;
}

interface RegistrosResponse {
  success: boolean;
  registros: RegistroExpediente[];
  message?: string;
}

interface MateriasResponse {
  success: boolean;
  materias: string[];
  message?: string;
}

interface SendFormResponse {
  success: boolean;
  message: string;
  codigo?: string;  
  detail?: string; 
}

@Component({
  selector: 'app-panel',
  imports: [FormsModule],
  templateUrl: './panel.html',
  styleUrl: './panel.css',
})
export class Panel implements OnInit {
  private apiUrl =
    'https://script.google.com/macros/s/AKfycbxj1XdIJb49TCumBl-BlsxUSFYLNDZB34AnRpmoJ_dS9Xp2zMHy96t97Tr4jlRnNn4/exec';

  expediente: ExpedienteActual | null = null;

  registros = signal<RegistroExpediente[]>([]);
  materias = signal<string[]>([]);

  readonly materiasSecretariaGeneral = [
    'Recusación',
    'Pagos',
    'Otros',
  ];

  readonly materiasTribunalArbitral = [
    'Demanda',
    'Ampliación de demanda',
    'Contestación de demanda',
    'Reconvención',
    'Excepción',
    'Alegato',
    'Otros',
  ];

  cargandoRegistros = signal(false);
  cargandoMaterias = signal(false);
  enviando = signal(false);

  error = signal('');
  mensaje = signal('');

  modalCarga = signal(false);
  modalConfirmacion = signal(false);
  progresoCarga = signal(0);

  codigoComprobante = signal('');
  fechaComprobante = signal('');

  comprobante = {
    expediente: '',
    anio: '',
    tipo: '',
    parte: '',
    destinatario: '',
    materia: '',
    sumilla: '',
  };

  nuevoRegistro = {
    parte: '',
    destinatario: '',
    materia: '',
    sumilla: '',
    linkPdf: '',
    linkWord: '',
    linkAnexos: '',
  };

  archivoPdf: File | null = null;
  archivoWord: File | null = null;
  archivosAnexos: File[] = [];

  archivoPdfNombre = '';
  archivoWordNombre = '';
  anexosNombre = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const data = sessionStorage.getItem('expedienteActual');

    if (!data) {
      this.router.navigate(['/seguimiento']);
      return;
    }

    try {
      this.expediente = JSON.parse(data) as ExpedienteActual;
    } catch {
      sessionStorage.removeItem('expedienteActual');
      this.router.navigate(['/seguimiento']);
      return;
    }

    this.cargarRegistros();
  }


  materiasDisponibles(): string[] {
    if (this.nuevoRegistro.destinatario === 'Secretaria General') {
      return this.materiasSecretariaGeneral;
    }

    if (this.nuevoRegistro.destinatario === 'Tribunal Arbitral Colegiado y/o único') {
      return this.materiasTribunalArbitral;
    }

    return [];
  }

  cambiarDestinatario(): void {
    this.nuevoRegistro.materia = '';
    this.error.set('');
    this.mensaje.set('');
  }

  cargarMaterias(): void {
    this.cargandoMaterias.set(true);

    const params = new HttpParams()
      .set('action', 'getMaterias')
      .set('_', Date.now().toString());

    this.http
      .get<MateriasResponse>(this.apiUrl, { params })
      .pipe(
        timeout({ first: 15000 }),
        catchError(() => {
          this.error.set('No se pudo cargar la lista de materias.');
          return of({ success: false, materias: [] as string[] });
        }),
        finalize(() => {
          this.cargandoMaterias.set(false);
        })
      )
      .subscribe((res) => {
        this.materias.set(res.materias || []);
      });
  }

  cargarRegistros(): void {
    if (!this.expediente) return;

    this.cargandoRegistros.set(true);
    this.error.set('');

    const params = new HttpParams()
      .set('action', 'getRegistros')
      .set('expediente', String(this.expediente.expediente))
      .set('anio', String(this.expediente.anio))
      .set('tipo', this.expediente.tipo)
      .set('_', Date.now().toString());

    this.http
      .get<RegistrosResponse>(this.apiUrl, { params })
      .pipe(
        timeout({ first: 15000 }),
        catchError(() => {
          this.error.set('No se pudo cargar el historial del expediente.');
          return of({ success: false, registros: [] as RegistroExpediente[] });
        }),
        finalize(() => {
          this.cargandoRegistros.set(false);
        })
      )
      .subscribe((res) => {
        const registrosVisibles = (res.registros || [])
          .map((registro) => this.normalizarRegistro(registro))
          .filter((registro) => registro.estado !== 'Pendiente');

        this.registros.set(registrosVisibles);
      });
  }

  seleccionarArchivo(event: Event, tipo: 'pdf' | 'word' | 'anexos'): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    if (tipo === 'pdf') {
      const archivo = input.files[0];

      if (archivo.type !== 'application/pdf') {
        this.error.set('El documento principal debe ser un archivo PDF.');
        input.value = '';
        return;
      }

      if (this.superaLimiteMb(archivo, 20)) {
        this.error.set(
          'El PDF supera los 20 MB. Súbelo a la nube y coloca el enlace.'
        );
        input.value = '';
        return;
      }

      this.archivoPdf = archivo;
      this.archivoPdfNombre = archivo.name;
    }

    if (tipo === 'word') {
      const archivo = input.files[0];
      const nombre = archivo.name.toLowerCase();

      if (!nombre.endsWith('.doc') && !nombre.endsWith('.docx')) {
        this.error.set('El documento Word debe ser .doc o .docx.');
        input.value = '';
        return;
      }

      if (this.superaLimiteMb(archivo, 20)) {
        this.error.set(
          'El Word supera los 20 MB. Súbelo a la nube y coloca el enlace.'
        );
        input.value = '';
        return;
      }

      this.archivoWord = archivo;
      this.archivoWordNombre = archivo.name;
    }

    if (tipo === 'anexos') {
      const archivos = Array.from(input.files);

      const archivoPesado = archivos.find((archivo) =>
        this.superaLimiteMb(archivo, 20)
      );

      if (archivoPesado) {
        this.error.set(
          `El anexo "${archivoPesado.name}" supera los 20 MB. Súbelo a la nube y coloca el enlace.`
        );
        input.value = '';
        return;
      }

      this.archivosAnexos = archivos;
      this.anexosNombre = archivos.map((archivo) => archivo.name).join(', ');
    }

    this.error.set('');
    this.mensaje.set('');
  }

  async registrarDocumento(): Promise<void> {
    if (!this.expediente || this.enviando()) return;

    if (!this.validarFormulario()) return;

    this.enviando.set(true);
    this.modalCarga.set(true);
    this.progresoCarga.set(0);
    this.error.set('');
    this.mensaje.set('Enviando documento, por favor espere...');

    try {
      const fecha = this.formatearFechaLocal(new Date());
      const codigo = this.generarCodigoComprobante();

      this.codigoComprobante.set(codigo);
      this.fechaComprobante.set(fecha);

      this.comprobante = {
        expediente: String(this.expediente.expediente),
        anio: String(this.expediente.anio),
        tipo: this.expediente.tipo,
        parte: this.nuevoRegistro.parte,
        destinatario: this.nuevoRegistro.destinatario,
        materia: this.nuevoRegistro.materia,
        sumilla: this.nuevoRegistro.sumilla.trim(),
      };

      const pdfBase64 = this.archivoPdf
        ? await this.archivoBase64(this.archivoPdf)
        : '';

      const wordBase64 = this.archivoWord
        ? await this.archivoBase64(this.archivoWord)
        : '';

      const anexosBase64 = await Promise.all(
        this.archivosAnexos.map((archivo) => this.archivoBase64(archivo))
      );

      const anexosNombres = this.archivosAnexos.map((archivo) => archivo.name);

      const body = new HttpParams()
        .set('action', 'sendForm')
        .set('codigo', codigo)
        .set('expediente', String(this.expediente.expediente))
        .set('anio', String(this.expediente.anio))
        .set('tipo', this.expediente.tipo)
        .set('id_expediente', String(this.expediente.id_expediente || ''))
        .set('parte', this.nuevoRegistro.parte)
        .set('destinatario', this.nuevoRegistro.destinatario)
        .set('materia', this.nuevoRegistro.materia)
        .set('sumilla', this.nuevoRegistro.sumilla.trim())
        .set('link_pdf', this.nuevoRegistro.linkPdf.trim())
        .set('link_word', this.nuevoRegistro.linkWord.trim())
        .set('link_anexo', this.nuevoRegistro.linkAnexos.trim())
        .set('pdf_base64', pdfBase64)
        .set('pdf_filename', this.archivoPdf?.name || '')
        .set('word_base64', wordBase64)
        .set('word_filename', this.archivoWord?.name || '')
        .set('anexo_base64_list', JSON.stringify(anexosBase64))
        .set('anexo_filename_list', JSON.stringify(anexosNombres));

      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      });

      const envioReal = firstValueFrom(
        this.http
          .post<SendFormResponse>(this.apiUrl, body.toString(), { headers })
          .pipe(
            timeout({ first: 120000 }),
            catchError(() => {
              const fallback: SendFormResponse = {
                success: false,
                message: 'No se pudo enviar el formulario. Intente nuevamente.',
                detail: 'Error de conexión o tiempo de espera agotado.',
                codigo: '',
              };

              return of(fallback);
            })
          )
      );

      const res = await this.animarCargaMientras(envioReal);

      if (!res.success) {
        this.error.set(
          res.detail || res.message || 'No se pudo registrar el documento.'
        );
        this.mensaje.set('');
        return;
      }

      this.codigoComprobante.set(res.codigo || codigo);

      this.mensaje.set(
        'Documento enviado correctamente. Puede descargar su comprobante PDF.'
      );

      this.limpiarFormulario();
      this.modalConfirmacion.set(true);
      this.cargarRegistros();
    } catch {
      this.error.set('No se pudo preparar el archivo para enviarlo.');
      this.mensaje.set('');
    } finally {
      this.enviando.set(false);
      this.modalCarga.set(false);
    }
  }


  cerrarModalConfirmacion(): void {
    this.modalConfirmacion.set(false);
  }

  llenarOtroFormulario(): void {
    this.modalConfirmacion.set(false);
    this.mensaje.set('');
    this.error.set('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  cerrarSesion(): void {
    sessionStorage.removeItem('expedienteActual');
    this.router.navigate(['/seguimiento']);
  }

  esLink(valor?: string): boolean {
    return !!valor && valor.startsWith('http');
  }

  puedeAbrirRegistro(registro: RegistroExpediente): boolean {
    return registro.puedeAbrir === true || registro.estado === 'Procesado';
  }

  estaEnRevision(registro: RegistroExpediente): boolean {
    return registro.estado === 'Revision';
  }

  tieneArchivo(registro: RegistroExpediente): boolean {
    return !!registro.pdf || !!registro.word || !!registro.anexo;
  }

  async descargarComprobantePdf(): Promise<void> {
    if (!this.codigoComprobante() || !this.fechaComprobante()) return;

    try {
      const logo = await this.cargarLogoPdfOpcional();

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const anchoPagina = doc.internal.pageSize.getWidth();
      const altoPagina = doc.internal.pageSize.getHeight();

      if (logo) {
        const marcaAncho = 115;
        const marcaAlto = marcaAncho / logo.proporcion;
        const marcaX = (anchoPagina - marcaAncho) / 2;
        const marcaY = (altoPagina - marcaAlto) / 2;

        doc.addImage(
          logo.marcaAgua,
          'PNG',
          marcaX,
          marcaY,
          marcaAncho,
          marcaAlto
        );

        const logoAncho = 28;
        const logoAlto = logoAncho / logo.proporcion;

        doc.addImage(logo.normal, 'PNG', 20, 6, logoAncho, logoAlto);
      }

      doc.setDrawColor(120, 140, 170);
      doc.setLineWidth(0.4);
      doc.line(20, 30, anchoPagina - 20, 30);

      doc.setTextColor(44, 76, 122);
      doc.setFont('times', 'bold');
      doc.setFontSize(11);
      doc.text(
        '¡Resolviendo conflictos para una cultura de paz!',
        anchoPagina / 2,
        altoPagina - 20,
        { align: 'center' }
      );

      doc.setFont('times', 'normal');
      doc.setFontSize(8.5);
      doc.text(
        'Jr. 28 de julio Nro. 736 - 2do. Piso (Alameda Valdelirios) - Huamanga – Ayacucho / Telf. 963 810 265',
        anchoPagina / 2,
        altoPagina - 14,
        { align: 'center' }
      );

      doc.text(
        'informes@cecard.org / www.cecard.org',
        anchoPagina / 2,
        altoPagina - 8,
        { align: 'center' }
      );

      doc.setDrawColor(120, 140, 170);
      doc.setLineWidth(0.4);
      doc.line(35, altoPagina - 24, anchoPagina - 35, altoPagina - 24);

      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Comprobante de envío de documento', anchoPagina / 2, 48, {
        align: 'center',
      });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);

      let y = 64;
      const salto = 9;

      doc.text(`Código: ${this.codigoComprobante()}`, 20, y);
      y += salto;

      doc.text(`Fecha de envío: ${this.fechaComprobante()}`, 20, y);
      y += salto;

      doc.text(`Expediente: ${this.comprobante.expediente}`, 20, y);
      y += salto;

      doc.text(`Año: ${this.comprobante.anio}`, 20, y);
      y += salto;

      doc.text(`Tipo: ${this.comprobante.tipo}`, 20, y);
      y += salto;

      const parteLineas = doc.splitTextToSize(
        `Parte: ${this.comprobante.parte}`,
        170
      ) as string[];

      doc.text(parteLineas, 20, y);
      y += parteLineas.length * 7 + 3;

      const destinatarioLineas = doc.splitTextToSize(
        `Destinatario: ${this.comprobante.destinatario}`,
        170
      ) as string[];

      doc.text(destinatarioLineas, 20, y);
      y += destinatarioLineas.length * 7 + 3;

      doc.text(`Materia: ${this.comprobante.materia}`, 20, y);
      y += salto;

      const sumillaLineas = doc.splitTextToSize(
        `Sumilla: ${this.comprobante.sumilla}`,
        170
      ) as string[];

      doc.text(sumillaLineas, 20, y);
      y += sumillaLineas.length * 7 + 8;

      doc.setFont('helvetica', 'bold');
      doc.text('Estado inicial: Pendiente de revisión', 20, y);
      y += salto;

      doc.setFont('helvetica', 'normal');
      doc.text(
        'Conserve este documento como constancia de envío. El documento será revisado por CECARD antes de mostrarse en el historial.',
        20,
        y,
        { maxWidth: 170 }
      );

      doc.save(`comprobante_${this.codigoComprobante()}.pdf`);
    } catch {
      this.error.set('No se pudo generar el PDF de comprobante.');
    }
  }

  private normalizarRegistro(registro: RegistroExpediente): RegistroExpediente {
    const estado = this.normalizarEstado(registro.estado);

    return {
      ...registro,
      estado,
      puedeAbrir: registro.puedeAbrir === true || estado === 'Procesado',
    };
  }

  private normalizarEstado(estado?: string): EstadoRegistro {
    const valor = String(estado || '').trim().toLowerCase();

    if (valor === 'procesado') return 'Procesado';
    if (valor === 'revision' || valor === 'revisión') return 'Revision';
    return 'Pendiente';
  }

  private validarFormulario(): boolean {
    if (!this.nuevoRegistro.parte) {
      this.error.set('Selecciona la parte que presenta el documento.');
      return false;
    }

    if (!this.nuevoRegistro.destinatario) {
      this.error.set('Selecciona a quién va dirigido el escrito.');
      return false;
      
    }

    if (!this.nuevoRegistro.materia) {
      this.error.set('Selecciona la materia del escrito.');
      return false;
    }

    if (!this.nuevoRegistro.sumilla.trim()) {
      this.error.set('Ingresa la sumilla del escrito.');
      return false;
    }

    const tienePdf = !!this.archivoPdf || !!this.nuevoRegistro.linkPdf.trim();

    if (!tienePdf) {
      this.error.set('Adjunta el documento principal PDF o coloca su enlace.');
      return false;
    }

    const tieneWord = !!this.archivoWord || !!this.nuevoRegistro.linkWord.trim();

    if (!tieneWord) {
      this.error.set('Adjunta el documento principal Word o coloca su enlace.');
      return false;
    }

    return true;
  }

  private limpiarFormulario(): void {
    this.nuevoRegistro = {
      parte: '',
      destinatario: '',
      materia: '',
      sumilla: '',
      linkPdf: '',
      linkWord: '',
      linkAnexos: '',
    };

    this.archivoPdf = null;
    this.archivoWord = null;
    this.archivosAnexos = [];

    this.archivoPdfNombre = '';
    this.archivoWordNombre = '';
    this.anexosNombre = '';
  }

  private superaLimiteMb(archivo: File, limiteMb: number): boolean {
    return archivo.size / (1024 * 1024) > limiteMb;
  }

  private archivoBase64(archivo: File): Promise<string> {
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

  private async cargarLogoPdfOpcional(): Promise<{
    normal: string;
    marcaAgua: string;
    proporcion: number;
  } | null> {
    const logoUrl = new URL('logo_pdf.png', document.baseURI).toString();
    const respuesta = await fetch(logoUrl);

    if (!respuesta.ok) {
      return null;
    }

    const blob = await respuesta.blob();
    const normal = await this.blobADataUrl(blob);
    const imagen = await this.cargarImagen(normal);

    const ancho = imagen.naturalWidth || imagen.width;
    const alto = imagen.naturalHeight || imagen.height;

    const canvas = document.createElement('canvas');
    canvas.width = ancho;
    canvas.height = alto;

    const contexto = canvas.getContext('2d');

    if (!contexto) {
      return null;
    }

    contexto.clearRect(0, 0, ancho, alto);
    contexto.globalAlpha = 0.25;
    contexto.drawImage(imagen, 0, 0, ancho, alto);

    return {
      normal,
      marcaAgua: canvas.toDataURL('image/png'),
      proporcion: ancho / alto,
    };
  }

  private blobADataUrl(blob: Blob): Promise<string> {
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

  private cargarImagen(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const imagen = new Image();
      imagen.onload = () => resolve(imagen);
      imagen.onerror = () => reject(new Error('No se pudo cargar el logo.'));
      imagen.src = src;
    });
  }

  private generarCodigoComprobante(): string {
    const fecha = new Date();
    const anio = fecha.getFullYear().toString().slice(-2);
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');

    const aleatorio = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    return `EXP${anio}${mes}${dia}-${aleatorio}`;
  }

  private formatearFechaLocal(fecha: Date): string {
    return fecha.toLocaleString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  private async animarCargaMientras<T>(promesa: Promise<T>): Promise<T> {
    let terminado = false;

    promesa
      .then(() => {
        terminado = true;
      })
      .catch(() => {
        terminado = true;
      });

    this.progresoCarga.set(0);

    while (!terminado && this.progresoCarga() < 90) {
      await this.esperar(120);

      const actual = this.progresoCarga();
      let nuevo = actual;

      if (actual < 60) {
        nuevo += Math.floor(Math.random() * 10) + 5;
      } else if (actual < 80) {
        nuevo += Math.floor(Math.random() * 5) + 2;
      } else {
        nuevo += 1;
      }

      this.progresoCarga.set(Math.min(nuevo, 90));
    }

    const resultado = await promesa;

    while (this.progresoCarga() < 100) {
      await this.esperar(50);
      this.progresoCarga.set(Math.min(this.progresoCarga() + 5, 100));
    }

    await this.esperar(300);

    return resultado;
  }

  private esperar(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), ms);
    });
  }
}
