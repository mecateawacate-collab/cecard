import { Component } from '@angular/core';

@Component({
  selector: 'app-jprd',
  imports: [],
  templateUrl: './jprd.html',
  styleUrl: './jprd.css',
})
export class Jprd {

  tabActivo:
  | 'documentos'
  | 'codigo-etica'
  | 'clausula'
  | 'tarifario'
  | 'adjudicadores'
  | 'formato'
  | 'legislacion' = 'documentos';




}
