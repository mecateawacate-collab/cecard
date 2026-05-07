import { Component } from '@angular/core';

@Component({
  selector: 'app-arbitraje',
  imports: [],
  templateUrl: './arbitraje.html',
  styleUrl: './arbitraje.css',
})
export class Arbitraje {

  tabActivo:
  | 'documentos'
  | 'codigo-etica'
  | 'clausula'
  | 'tarifario'
  | 'arbitros'
  | 'formatos'
  | 'legislacion' = 'documentos';


}
