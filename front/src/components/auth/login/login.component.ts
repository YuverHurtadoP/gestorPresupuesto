import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [AuthService]
})
export class LoginComponent {

  loginForm: FormGroup;
   private notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });

  constructor(private router: Router,private fb: FormBuilder,private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }


   onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.notyf.error('Por favor completa todos los campos correctamente.');
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login({ email: email!, password: password! }).subscribe({
      next: (res) => {
        this.notyf.success('Inicio de sesión exitoso');
        console.log(res);

        // Guardar token en localStorage (opcional, depende de tu backend)
        localStorage.setItem('token', res.token);


       this.router.navigate(['/crashflow/budget/list']);
      },
      error: (err) => {
        this.notyf.error(err.error?.message || 'Credenciales inválidas');
        console.error(err);
      }
    });
  }


  // Getters para acceso fácil en la vista
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

}
