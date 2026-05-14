import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface TrabajadorCecard {
  id?: string;
  nombre?: string;
  oficina?: string;
  user?: string;
}

interface RegistroControl {
  rowNumber: number;
  fechaEnvio: string;
  expediente: string;
  anio: string;
  tipo: string;
  parte: string;
  destinatario: string;
  materia: string;
  sumilla: string;
  pdf: string;
  word: string;
  anexo: string;
  estado: string;
  actualizando?: boolean;
}

interface ResumenControl {
  total: number;
  pendientes: number;
  procesados: number;
  observados: number;
  hoy: number;
}

@Component({
  selector: 'app-control',
  imports: [FormsModule, RouterLink],
  templateUrl: './control.html',
  styleUrl: './control.css'
})
export class Control implements OnInit {
  trabajador: TrabajadorCecard | null = null;
  registros: RegistroControl[] = [];
  resumen: ResumenControl = {
    total: 0,
    pendientes: 0,
    procesados: 0,
    observados: 0,
    hoy: 0
  };

  estados = ['Pendiente', 'En revisión', 'Procesado', 'Observado', 'Rechazado'];
  loading = false;
  error = '';
  mensaje = '';

  private readonly apiUrl = 'https://script.google.com/macros/s/AKfycbxj1XdIJb49TCumBl-BlsxUSFYLNDZB34AnRpmoJ_dS9Xp2zMHy96t97Tr4jlRnNn4/exec';

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const raw = localStorage.getItem('trabajadorCecard');

    if (!raw) {
      this.router.navigate(['/configuracion']);
      return;
    }

    try {
      this.trabajador = JSON.parse(raw);
      this.cdr.detectChanges();
      void this.cargarRegistros();
    } catch {
      localStorage.removeItem('trabajadorCecard');
      this.router.navigate(['/configuracion']);
    }
  }

  get inicialTrabajador(): string {
    return this.trabajador?.nombre
      ? this.trabajador.nombre.charAt(0).toUpperCase()
      : 'C';
  }

  async cargarRegistros(): Promise<void> {
    this.loading = true;
    this.error = '';
    this.mensaje = '';
    this.cdr.detectChanges();

    try {
      const params = new URLSearchParams();
      params.set('action', 'getResumenControl');
      params.set('_t', String(Date.now()));

      const response = await fetch(`${this.apiUrl}?${params.toString()}`, {
        method: 'GET',
        cache: 'no-store'
      });

      const data = await response.json();

      if (!data.success) {
        this.error = data.message || 'No se pudieron cargar los registros.';
        return;
      }

      this.registros = data.registros || [];
      this.resumen = data.resumen || this.resumen;
    } catch (error) {
      console.error('Error cargando registros:', error);
      this.error = 'No se pudo conectar con el servidor.';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async cambiarEstado(registro: RegistroControl, nuevoEstado: string): Promise<void> {
    if (!nuevoEstado || registro.estado === nuevoEstado) {
      return;
    }

    const estadoAnterior = registro.estado;
    registro.estado = nuevoEstado;
    registro.actualizando = true;
    this.error = '';
    this.mensaje = '';
    this.cdr.detectChanges();

    try {
      const params = new URLSearchParams();
      params.set('action', 'actualizarEstadoRegistro');
      params.set('rowNumber', String(registro.rowNumber));
      params.set('estado', nuevoEstado);
      params.set('_t', String(Date.now()));

      const response = await fetch(`${this.apiUrl}?${params.toString()}`, {
        method: 'GET',
        cache: 'no-store'
      });

      const data = await response.json();

      if (!data.success) {
        registro.estado = estadoAnterior;
        this.error = data.message || 'No se pudo actualizar el estado.';
        return;
      }

      this.resumen = data.resumen || this.calcularResumenLocal();
      this.mensaje = data.message || 'Estado actualizado correctamente.';
    } catch (error) {
      console.error('Error actualizando estado:', error);
      registro.estado = estadoAnterior;
      this.error = 'No se pudo conectar con el servidor.';
    } finally {
      registro.actualizando = false;
      this.cdr.detectChanges();
    }
  }

  calcularResumenLocal(): ResumenControl {
    const hoy = new Date();
    const hoyTexto = `${String(hoy.getDate()).padStart(2, '0')}/${String(hoy.getMonth() + 1).padStart(2, '0')}/${hoy.getFullYear()}`;

    return {
      total: this.registros.length,
      pendientes: this.registros.filter(r => this.normalizar(r.estado) === 'pendiente').length,
      procesados: this.registros.filter(r => this.normalizar(r.estado) === 'procesado').length,
      observados: this.registros.filter(r => this.normalizar(r.estado) === 'observado').length,
      hoy: this.registros.filter(r => r.fechaEnvio === hoyTexto).length
    };
  }

  estadoClase(estado: string): string {
    const normalizado = this.normalizar(estado);

    if (normalizado === 'procesado') {
      return 'bg-green-50 text-green-700 border-green-100';
    }

    if (normalizado === 'pendiente') {
      return 'bg-yellow-50 text-yellow-700 border-yellow-100';
    }

    if (normalizado === 'observado' || normalizado === 'rechazado') {
      return 'bg-red-50 text-red-700 border-red-100';
    }

    return 'bg-blue-50 text-blue-700 border-blue-100';
  }

  tieneArchivos(registro: RegistroControl): boolean {
    return !!(registro.pdf || registro.word || registro.anexo);
  }

  cerrarSesion(): void {
    localStorage.removeItem('trabajadorCecard');
    this.router.navigate(['/configuracion']);
  }

  private normalizar(valor: string): string {
    return String(valor || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}
