import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Notyf } from 'notyf';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
   imports: [CommonModule, ReactiveFormsModule,RouterModule, HttpClientModule ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [AuthService]
})
export class RegisterComponent {
 registerForm: FormGroup;
   private notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', [Validators.required, Validators.minLength(6)]],
    },
   { validators: this.passwordsMatchValidator });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.notyf.error('Por favor, corrige los errores del formulario');
      return;
    }

    const { name, email, password } = this.registerForm.value;

    this.authService.register({ nombre: name!, email: email!, password: password! }).subscribe({
      next: (res) => {
        this.notyf.success('Usuario creado correctamente');
        console.log(res);

        // 👇 redirigir al login
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.notyf.error(err.error?.message || 'Error al registrar usuario');
        console.error(err);
      }
    });
  }

  passwordsMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirm = group.get('confirm')?.value;
    return password === confirm ? null : { passwordsMismatch: true };
  };


  // Getters para acceso fácil en la vista
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
    get name() {
    return this.registerForm.get('name');
  }
  get confirm() {
    return this.registerForm.get('confirm');
  }

}
