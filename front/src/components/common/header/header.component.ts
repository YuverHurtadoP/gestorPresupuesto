import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterOutlet,RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
dropdownOpen = false;
nombreUsuario: string = 'Usuario';
email: string = '';

constructor(private router: Router) {}
  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      this.nombreUsuario = userData.nombre || 'Usuario';
      this.email = userData.email || '';
    } else {
      console.log('No se encontró usuario en localStorage');
    }
  }

toggleDropdown() {
  this.dropdownOpen = !this.dropdownOpen;
}

closeDropdown() {
  this.dropdownOpen = false;
}

  logout() {
    // Elimina token o info del usuario
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Redirige al login
    this.router.navigate(['/auth/login']);
  }
  home(){
       this.router.navigate(['/crashflow/budget/list']);
  }
}
