import { Routes } from '@angular/router';

import { Inicio } from './paginas/inicio/inicio';
import { MesaPartes } from './sistema/mesa-partes/mesa-partes';
import { Nosotros } from './paginas/nosotros/nosotros';
import { Servicios } from './paginas/servicios/servicios';
import { Transparencia } from './paginas/transparencia/transparencia';
import { Comunicados } from './paginas/comunicados/comunicados';

export const routes: Routes = [

{   path: '',
    component: Inicio},

{   path: 'nosotros',
    component: Nosotros},

{   path: 'servicios',
    component: Servicios},

{   path: 'transparencia',
    component: Transparencia},

{   path: 'comunicados',
    component: Comunicados},

{   path: 'mesa-partes',
    component: MesaPartes}
    
];
