import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, finalize, of, timeout, TimeoutError } from 'rxjs';

interface LoginResponse {
  success: boolean;
  message?: string;
  expediente?: string | number;
  anio?: string | number;
  tipo?: string;
  demandante?: string;
  demandado?: string;
  estado?: string;
  tribunal?: string;
  id_expediente?: string | number;
}

interface TiposResponse {
  success?: boolean;
  message?: string;
  detail?: string;
  tipos?: string[];
}

@Component({
  selector: 'app-seguimiento',
  imports: [FormsModule],
  templateUrl: './seguimiento.html',
  styleUrl: './seguimiento.css',
})
export class Seguimiento implements OnInit {
  private apiUrl =
    'https://script.google.com/macros/s/AKfycbxj1XdIJb49TCumBl-BlsxUSFYLNDZB34AnRpmoJ_dS9Xp2zMHy96t97Tr4jlRnNn4/exec';

  numeroExpediente = signal('');
  anio = signal('');
  tipo = signal('');
  password = signal('');

  tipos = signal<string[]>([]);

  cargando = signal(false);
  cargandoTipos = signal(false);
  error = signal('');

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarTipos();
  }

  cargarTipos(): void {
    this.cargandoTipos.set(true);
    this.error.set('');

    // Fallback para que el login NO quede bloqueado si Apps Script falla al cargar tipos.
    const tiposFallback = ['ARB - CECARD', 'JPRD - CECARD'];

    const params = new HttpParams()
      .set('action', 'getTipos')
      .set('_', Date.now().toString());

    this.http
      .get<TiposResponse>(this.apiUrl, { params })
      .pipe(
        timeout({ first: 10000 }),
        catchError((err) => {
          console.error('ERROR getTipos:', err);

          this.error.set(
            'No se pudieron cargar los tipos desde el servidor. Usando tipos por defecto.'
          );

          const fallback: TiposResponse = {
            success: false,
            message: 'No se pudieron cargar los tipos desde el servidor.',
            detail: 'Fallback local aplicado para no bloquear el login.',
            tipos: tiposFallback,
          };

          return of(fallback);
        }),
        finalize(() => {
          this.cargandoTipos.set(false);
        })
      )
      .subscribe((res) => {
        console.log('RESPUESTA getTipos:', res);

        if (res?.success === false && !res.tipos?.length) {
          this.error.set(res.detail || res.message || 'Error al cargar tipos.');
          this.tipos.set(tiposFallback);
          return;
        }

        this.tipos.set(res?.tipos?.length ? res.tipos : tiposFallback);
      });
  }

  ingresar(): void {
    if (this.cargando()) return;

    this.error.set('');

    const expedienteValor = this.numeroExpediente().trim();
    const anioValor = this.anio().trim();
    const tipoValor = this.tipo().trim();
    const passwordValor = this.password().trim();

    if (!expedienteValor) {
      this.error.set('Ingresa el número de expediente.');
      return;
    }

    if (!anioValor) {
      this.error.set('Ingresa el año.');
      return;
    }

    if (!tipoValor) {
      this.error.set('Selecciona el tipo de expediente.');
      return;
    }

    if (!passwordValor) {
      this.error.set('Ingresa la contraseña.');
      return;
    }

    this.cargando.set(true);

    const params = new HttpParams()
      .set('action', 'login')
      .set('expediente', expedienteValor)
      .set('anio', anioValor)
      .set('tipo', tipoValor)
      .set('pass', passwordValor)
      .set('_', Date.now().toString());

    this.http
      .get<LoginResponse>(this.apiUrl, { params })
      .pipe(
        timeout({ first: 10000 }),
        catchError((err) => {
          console.error('ERROR login:', err);

          if (err instanceof TimeoutError || err.name === 'TimeoutError') {
            this.error.set(
              'Se alcanzó el límite de tiempo. Intente otra vez o revise los datos ingresados.'
            );
          } else {
            this.error.set(
              'No se pudo conectar con el servidor. Intente nuevamente.'
            );
          }

          return of(null);
        }),
        finalize(() => {
          this.cargando.set(false);
        })
      )
      .subscribe((res) => {
        console.log('RESPUESTA login:', res);

        if (!res) return;

        if (res.success) {
          sessionStorage.setItem('expedienteActual', JSON.stringify(res));
          this.router.navigate(['/panel']);
          return;
        }

        this.error.set(
          res.message || 'Credenciales inválidas. Revisa los datos ingresados.'
        );
      });
  }
}
