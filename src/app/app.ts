import { Component } from '@angular/core';
import { Sitio } from './layout/sitio/sitio';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Sitio],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}