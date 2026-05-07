import { Component } from '@angular/core';

interface Expediente {
  nombre: string;
  archivo: string;
}

@Component({
  selector: 'app-decisiones',
  imports: [],
  templateUrl: './decisiones.html',
  styleUrl: './decisiones.css',
})
export class Decisiones {
  anios: number[] = [2026];

  anioSeleccionado: number = 2026;

  expedientesPorAnio: Record<number, Expediente[]> = {
    2026: []
  };

  get expedientesSeleccionados(): Expediente[] {
    return this.expedientesPorAnio[this.anioSeleccionado] ?? [];
  }

  seleccionarAnio(anio: number): void {
    this.anioSeleccionado = anio;
  }
}