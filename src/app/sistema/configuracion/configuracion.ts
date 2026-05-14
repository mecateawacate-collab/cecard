import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-configuracion',
  imports: [FormsModule, RouterLink],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css'
})
export class Configuracion {
  usuario = '';
  password = '';
  mostrarPassword = false;
  error = '';
  loading = false;

  private readonly apiUrl = 'https://script.google.com/macros/s/AKfycbxj1XdIJb49TCumBl-BlsxUSFYLNDZB34AnRpmoJ_dS9Xp2zMHy96t97Tr4jlRnNn4/exec';

  constructor(private router: Router) {}

  async ingresar(): Promise<void> {
    this.error = '';

    const usuarioLimpio = this.usuario.trim();
    const passwordLimpio = this.password.trim();

    if (!usuarioLimpio || !passwordLimpio) {
      this.error = 'Ingresa tu usuario y contraseña.';
      return;
    }

    this.loading = true;

    try {
      const params = new URLSearchParams();
      params.set('action', 'loginTrabajador');
      params.set('user', usuarioLimpio);
      params.set('password', passwordLimpio);

      const response = await fetch(`${this.apiUrl}?${params.toString()}`, {
        method: 'GET'
      });

      const data = await response.json();

      if (!data.success) {
        this.error = data.message || 'Usuario o contraseña incorrectos.';
        return;
      }

      localStorage.setItem('trabajadorCecard', JSON.stringify(data.trabajador));
      this.router.navigate(['/control']);

    } catch (error) {
      console.error('Error login trabajador:', error);
      this.error = 'No se pudo conectar con el servidor. Intenta nuevamente.';
    } finally {
      this.loading = false;
    }
  }
}