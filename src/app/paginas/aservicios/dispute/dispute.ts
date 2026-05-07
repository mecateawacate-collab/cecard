import { Component } from '@angular/core';

@Component({
  selector: 'app-dispute',
  imports: [],
  templateUrl: './dispute.html',
  styleUrl: './dispute.css',
})
export class Dispute {

  tabActivo:
  | 'documentos'
  | 'codigo-etica'
  | 'clausula'
  | 'tarifario'
  | 'adjudicadores'
  | 'formato'
  | 'legislacion' = 'documentos';



}
