import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  menu_abierto: boolean = false;
  submenu_nosotros: boolean = false;
  submenu_servicios: boolean = false;
  submenu_transparencia: boolean = false;

  alternar_menu(): void {
    this.menu_abierto = !this.menu_abierto;
  }

  cerrar_menu(): void {
    this.menu_abierto = false;
    this.submenu_nosotros = false;
    this.submenu_servicios = false;
    this.submenu_transparencia = false;
  }

  alternar_nosotros(): void {
    this.submenu_nosotros = !this.submenu_nosotros;
    this.submenu_servicios = false;
    this.submenu_transparencia = false;
  }

  alternar_servicios(): void {
    this.submenu_servicios = !this.submenu_servicios;
    this.submenu_nosotros = false;
    this.submenu_transparencia = false;
  }

  alternar_transparencia(): void {
    this.submenu_transparencia = !this.submenu_transparencia;
    this.submenu_nosotros = false;
    this.submenu_servicios = false;
  }
}