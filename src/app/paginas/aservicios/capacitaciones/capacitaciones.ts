import { Component } from '@angular/core';

interface EventoCapacitacion {
  imagen: string;
  alt: string;
  estado: string;
  estadoColor: string;
  titulo: string;
  fecha: string;
  descripcion: string;
  enlace: string;
  textoEnlace: string;
  mostrarInfo?: boolean;
}
@Component({
  selector: 'app-capacitaciones',
  imports: [],
  templateUrl: './capacitaciones.html',
  styleUrl: './capacitaciones.css',
})


export class Capacitaciones {
  
  
  aniosOrdenados: number[] = [2026, 2025, 2024, 2023];
  
  modalAbierto = false;
  imagenModal = '';
  altModal = 'Afiche ampliado';
  
  eventos: EventoCapacitacion[] = [
    {
    imagen: '/img/afiches/2026/30-4-2026.png',
    alt: 'Afiche del Foro Académico Mensual de CECARD sobre laudos parciales y revisión judicial del laudo arbitral',
    estado: 'Finalizado',
    estadoColor: 'bg-[#2e2a57]/90',
    titulo: 'Foro Académico Mensual: Laudos Parciales y Revisión Judicial del Laudo Arbitral',
    fecha: '30/04/2026',
    descripcion: 'Foro académico mensual de CECARD desarrollado como evento virtual gratuito por Google Meet. Se abordarán los temas “Laudos Parciales: Versatilidad y utilidad” y “La revisión judicial del laudo arbitral por defectos o vicios en su motivación”, con la participación de los abogados Juan Manuel Fiestas Chunga y Andoni Luis Torres Villegas. Se entregarán constancias gratuitas a los asistentes.',
    enlace: '/img/afiches/info/30-4-2026.pdf',
    textoEnlace: 'Ver más información'
  },
  {
    imagen: '/img/afiches/2026/31-3-2026.jpeg',
    alt: 'Afiche del Seminario Académico CECARD de marzo de 2026',
    estado: 'Finalizado',
    estadoColor: 'bg-[#2e2a57]/90',
    titulo: 'Seminario Académico CECARD - Marzo 2026',
    fecha: '31/03/2026',
    descripcion: 'Seminario académico organizado por CECARD para el martes 31 de marzo de 2026. Participan el Dr. Carlos Enrique Sandoval Isasi con la ponencia “Contratación Pública” de 5:00 p. m. a 6:00 p. m. y la Dra. Claudia Cecilia Lau Buendía con la ponencia “Arbitraje en Contratación Pública” de 6:00 p. m. a 7:00 p. m. Incluye constancias gratuitas para los asistentes e inscripciones mediante código QR.',
    enlace: '/img/afiches/info/31-3-2026.pdf',
    textoEnlace: 'Ver más información'
  },
  {
    imagen: '/img/afiches/2026/4-2-2026.jpeg',
    alt: 'Evento: Ciclo de capacitación académica gratuita',
    estado: 'Finalizado',
    estadoColor: 'bg-gray-800/90',
    titulo: 'Ciclo de capacitación académica gratuita',
    fecha: '04/02/2026',
    descripcion: 'Programa general del ciclo académico gratuito de CECARD, desarrollado del 4 al 6 de febrero de 2026, con ponencias sobre arbitraje, JPRD y contrataciones con el Estado.',
    enlace: '/img/afiches/info/04-02-2026.pdf',
    textoEnlace: 'Ver más información'
  },
  {
    imagen: '/img/afiches/2025/14-11-2025.jpeg',
    alt: 'Evento: II Congreso Nacional de Contrataciones Públicas, Arbitraje y Junta de Prevención y Resolución de Disputas',
    estado: 'Finalizado',
    estadoColor: 'bg-gray-800/90',
    titulo: 'II Congreso Nacional de Contrataciones Públicas, Arbitraje y Junta de Prevención y Resolución de Disputas',
    fecha: '14/11/2025',
    descripcion: 'Evento académico sobre retos y oportunidades en la nueva era de las contrataciones públicas.',
    enlace: '/img/afiches/info/14-11-2022.pdf',
    textoEnlace: 'Ver más información'
  },
  {
    imagen: '/img/afiches/2025/21-7-2025.jpeg',
    alt: 'Evento: Perspectiva del Arbitraje en la Nueva Ley General de Contrataciones Públicas - Ley N° 32069',
    estado: 'Finalizado',
    estadoColor: 'bg-gray-800/90',
    titulo: 'Perspectiva del Arbitraje en la Nueva Ley General de Contrataciones Públicas - Ley N° 32069',
    fecha: '21/07/2025',
    descripcion: 'Seminario con el Abg. Daniel Triveño Daza a las 5:00 p. m. por Google Meet.',
    enlace: '#',
    textoEnlace: 'No disponible'
  },
  {
    imagen: '/img/afiches/2024/24-10-2024.jpeg',
    alt: 'Evento: Parámetros a seguir para elegir correctamente a un árbitro, a propósito de la modificación de la Ley de Contrataciones',
    estado: 'Finalizado',
    estadoColor: 'bg-gray-800/90',
    titulo: 'Parámetros a seguir para elegir correctamente a un árbitro, a propósito de la modificación de la Ley de Contrataciones',
    fecha: '24/10/2024',
    descripcion: 'Conferencia con la Abg. Kreslin Arrea Sánchez 6:00 p. m. por Google Meet.',
    enlace: '#',
    textoEnlace: 'No disponible'
  },
  {
    imagen: '/img/afiches/2024/10-10-2024.jpeg',
    alt: 'Evento: Conferencia sobre la prevención y resolución de disputas en la nueva ley general de contrataciones públicas',
    estado: 'Finalizado',
    estadoColor: 'bg-gray-800/90',
    titulo: 'Conferencia sobre la prevención y resolución de disputas en la nueva ley general de contrataciones públicas',
    fecha: '10/10/2024',
    descripcion: 'Conferencia con la Abg. María del Carmen Padilla 6:00 p. m. por Google Meet.',
    enlace: '#',
    textoEnlace: 'No disponible'
  },
  {
    imagen: '/img/afiches/2024/26-9-2024.jpeg',
    alt: 'Evento: Anulación de Laudo arbitral por vicios o defectos en su motivación',
    estado: 'Finalizado',
    estadoColor: 'bg-gray-800/90',
    titulo: 'Anulación de Laudo arbitral por vicios o defectos en su motivación',
    fecha: '26/09/2024',
    descripcion: 'Conferencia con la Abg. Andoni Torres Villegas 6:00 p. m. por Google Meet.',
    enlace: '#',
    textoEnlace: 'No disponible'
  },
  {
    imagen: '/img/afiches/2024/10-9-2024.jpeg',
    alt: 'Evento: Conferencia sobre la Junta de Resolución de Disputas y su evolución en la Ley de Contrataciones del Estado',
    estado: 'Finalizado',
    estadoColor: 'bg-gray-800/90',
    titulo: 'Conferencia sobre la Junta de Resolución de Disputas y su evolución en la Ley de Contrataciones del Estado',
    fecha: '10/09/2024',
    descripcion: 'Conferencia con la Abg. Carol Yanely Apaza Moncada.',
    enlace: '#',
    textoEnlace: 'No disponible'
  },
  {
    imagen: '/img/afiches/2024/12-7-2024.jpeg',
    alt: 'Evento: Congreso Nacional de Contrataciones Públicas, Arbitraje y Resolución de Disputas',
    estado: 'Finalizado',
    estadoColor: 'bg-gray-800/90',
    titulo: 'Congreso Nacional de Contrataciones Públicas, Arbitraje y Resolución de Disputas',
    fecha: '12/07/2024',
    descripcion: 'Evento académico orientado a transformar conflictos en oportunidades.',
    enlace: '/img/afiches/info/12-7-2024.pdf',
    textoEnlace: 'Ver más información'
  },
  {
    imagen: '/img/afiches/2024/20-6-2024.jpeg',
    alt: 'Evento: Condiciones para ser árbitro en un proceso arbitral de contrataciones del Estado',
    estado: 'Finalizado',
    estadoColor: 'bg-gray-800/90',
    titulo: 'Condiciones para ser árbitro en un proceso arbitral de contrataciones del Estado',
    fecha: '20/06/2024',
    descripcion: 'Conferencia del Dr. José Rodrigo Rosales sobre los requisitos para desempeñarse como árbitro en contrataciones del Estado.',
    enlace: '#',
    textoEnlace: 'No disponible'
  },
  {
    imagen: '/img/afiches/2024/22-5-2024.jpeg',
    alt: 'Evento: Conferencia sobre las implicancias legales de la participación de consorcios',
    estado: 'Finalizado',
    estadoColor: 'bg-gray-800/90',
    titulo: 'Conferencia sobre las implicancias legales de la participación de consorcios',
    fecha: '22/05/2024',
    descripcion: 'Conferencia con el Dr. Adolfo Pulgar Soárez.',
    enlace: '#',
    textoEnlace: 'No disponible'
  },
  {
    imagen: '/img/afiches/2024/18-4-2024.jpeg',
    alt: 'Evento: Conferencia sobre arbitraje de emergencia',
    estado: 'Finalizado',
    estadoColor: 'bg-gray-800/90',
    titulo: 'Conferencia sobre arbitraje de emergencia',
    fecha: '18/04/2024',
    descripcion: 'Conferencia con el Abg. Juan Fiestas Chunga sobre arbitraje de emergencia.',
    enlace: '#',
    textoEnlace: 'No disponible'
  },
  {
    imagen: '/img/afiches/2024/21-3-2024.jpeg',
    alt: 'Evento: Ejecución de obras y arbitraje',
    estado: 'Finalizado',
    estadoColor: 'bg-[#2e2a57]/90',
    titulo: 'Ejecución de obras y arbitraje',
    fecha: '21/03/2024',
    descripcion: 'Evento realizado en CECARD a las 6:00 p. m. vía Google Meet.',
    enlace: '#',
    textoEnlace: 'No disponible'
  },
  {
    imagen: '/img/afiches/2023/25-8-2023.jpeg',
    alt: 'Evento: Ejecución contractual y aplicación de penalidades en las contrataciones del Estado',
    estado: 'Finalizado',
    estadoColor: 'bg-gray-800/90',
    titulo: 'Ejecución contractual y aplicación de penalidades en las contrataciones del Estado',
    fecha: '25/08/2023',
    descripcion: 'Análisis sobre la ejecución contractual y la problemática en la aplicación de penalidades en contratos con el Estado.',
    enlace: '#',
    textoEnlace: 'No disponible'
  },
  {
    imagen: '/img/afiches/2023/03-2-2023.jpeg',
    alt: 'Evento: La conciliación y el arbitraje en las contrataciones públicas',
    estado: 'Finalizado',
    estadoColor: 'bg-gray-800/90',
    titulo: 'La conciliación y el arbitraje en las contrataciones públicas',
    fecha: '03/02/2023',
    descripcion: 'Jornada académica sobre estrategias para afrontar un proceso arbitral, arbitraje de emergencia y beneficios de la conciliación en las contrataciones públicas.',
    enlace: '#',
    textoEnlace: 'No disponible'
  }
];

eventosPorAnio(anio: number): EventoCapacitacion[] {
  return this.eventos
    .filter((evento) => this.parseFecha(evento.fecha).getFullYear() === anio)
    .sort((a, b) => this.parseFecha(b.fecha).getTime() - this.parseFecha(a.fecha).getTime());
}

parseFecha(fecha: string): Date {
  const fechaNormalizada = fecha.replace(/-/g, '/');
  const [dia, mes, anio] = fechaNormalizada.split('/').map(Number);

  return new Date(anio, mes - 1, dia);
}

alternarInfo(evento: EventoCapacitacion): void {
  evento.mostrarInfo = !evento.mostrarInfo;
}

abrirModal(evento: EventoCapacitacion): void {
  this.imagenModal = evento.imagen;
  this.altModal = evento.alt || 'Afiche ampliado';
  this.modalAbierto = true;
}

cerrarModal(): void {
  this.modalAbierto = false;
  this.imagenModal = '';
  this.altModal = 'Afiche ampliado';
}

  
}
