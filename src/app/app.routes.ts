import { Routes } from '@angular/router';

// Servicios
import { Arbitraje } from './paginas/aservicios/arbitraje/arbitraje';
import { Capacitaciones } from './paginas/aservicios/capacitaciones/capacitaciones';
import { Conciliacion } from './paginas/aservicios/conciliacion/conciliacion';
import { Consultoria } from './paginas/aservicios/consultoria/consultoria';
import { Dispute } from './paginas/aservicios/dispute/dispute';
import { Jprd } from './paginas/aservicios/jprd/jprd';

// Paginas
import { CanalDenuncia } from './paginas/canal-denuncia/canal-denuncia';
import { Comunicados } from './paginas/comunicados/comunicados';
import { Decisiones } from './paginas/decisiones/decisiones';
import { Etica } from './paginas/etica/etica';
import { Inicio } from './paginas/inicio/inicio';
import { Laudos } from './paginas/laudos/laudos';
import { Nosotros } from './paginas/nosotros/nosotros';
import { Sistema } from './paginas/sistema/sistema';
import { Transparencia } from './paginas/transparencia/transparencia';

// Sistema
import { MesaPartes } from './sistema/mesa-partes/mesa-partes';
import { Seguimiento } from './sistema/seguimiento/seguimiento';

export const routes: Routes = [
  // Redirección a la página de inicio
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },

  // Servicios
  { path: 'arbitraje', component: Arbitraje },
  { path: 'capacitaciones', component: Capacitaciones },
  { path: 'conciliacion', component: Conciliacion },
  { path: 'consultoria', component: Consultoria },
  { path: 'dispute', component: Dispute },
  { path: 'jprd', component: Jprd },

  // Paginas
  { path: 'canal-denuncia', component: CanalDenuncia },
  { path: 'comunicados', component: Comunicados },
  { path: 'decisiones', component: Decisiones },
  { path: 'etica', component: Etica },
  { path: 'inicio', component: Inicio },
  { path: 'laudos', component: Laudos },
  { path: 'nosotros', component: Nosotros },
  { path: 'sistema', component: Sistema },
  { path: 'transparencia', component: Transparencia },

  // Sistema
  { path: 'mesa-partes', component: MesaPartes },
  { path: 'seguimiento', component: Seguimiento },

];