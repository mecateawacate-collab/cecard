import { Component } from '@angular/core';
import { Footer } from "../../componentes/footer/footer";
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../componentes/navbar/navbar';

@Component({
  selector: 'app-sitio',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './sitio.html',
  styleUrl: './sitio.css',
})
export class Sitio {}