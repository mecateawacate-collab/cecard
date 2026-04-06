import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';

interface Diapositiva {
  imagen: string;
  titulo: string;
  enlace: string;
}

@Component({
  selector: 'app-inicio',
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit, OnDestroy {
  diapositivas: Diapositiva[] = [
    {
      imagen: '/inicio/local/6.png',
      titulo: 'Conciliación Extrajudicial',
      enlace: '/servicios/conciliacion',
    },
    {
      imagen: '/inicio/local/exterior_mejorado.png',
      titulo: 'Arbitrajes',
      enlace: '/servicios/arbitraje',
    },
    {
      imagen: '/inicio/local/9.png',
      titulo: 'Juntas de Prevención y Resolución de Disputas',
      enlace: '/servicios/jprd',
    },
    {
      imagen: '/inicio/local/16.png',
      titulo: 'Dispute Boards',
      enlace: '/servicios/dispute',
    },
    {
      imagen: '/inicio/local/10.png',
      titulo: 'Capacitaciones',
      enlace: '/servicios/capacitaciones',
    },
  ];

  indice_actual: number = 0;
  intervalo_id: number | null = null;
  tiempo_auto: number = 4000;

  constructor(
    private zona: NgZone,
    private detector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.iniciar_auto();
  }

  ngOnDestroy(): void {
    this.detener_auto();
  }

  get diapositiva_actual(): Diapositiva {
    return this.diapositivas[this.indice_actual];
  }

  siguiente(): void {
    this.indice_actual = (this.indice_actual + 1) % this.diapositivas.length;
    this.detector.detectChanges();
  }

  anterior(): void {
    this.indice_actual =
      (this.indice_actual - 1 + this.diapositivas.length) % this.diapositivas.length;
    this.detector.detectChanges();
  }

  ir_a(indice: number): void {
    this.indice_actual = indice;
    this.detector.detectChanges();
    this.reiniciar_auto();
  }

  iniciar_auto(): void {
    this.detener_auto();

    this.zona.runOutsideAngular((): void => {
      this.intervalo_id = window.setInterval((): void => {
        this.zona.run((): void => {
          this.siguiente();
        });
      }, this.tiempo_auto);
    });
  }

  detener_auto(): void {
    if (this.intervalo_id !== null) {
      clearInterval(this.intervalo_id);
      this.intervalo_id = null;
    }
  }

  reiniciar_auto(): void {
    this.iniciar_auto();
  }
}