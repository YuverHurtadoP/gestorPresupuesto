import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { Notyf } from 'notyf';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();

  form!: FormGroup;
  private notyf = new Notyf({
    duration: 3000,
    position: { x: 'right', y: 'top' },
  });

  constructor(private router: Router,private fb: FormBuilder, private userService: AuthService) {
    this.form = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // ✅ Validador personalizado
  passwordMatchValidator(group: FormGroup) {
    const newPass = group.get('newPassword')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return newPass === confirmPass ? null : { mismatch: true };
  }

  onClose() {
    this.close.emit();
    this.form.reset();
  }

  changePassword() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword } = this.form.value;

    this.userService.changePassword({ currentPassword, newPassword }).subscribe({
      next: () => {

        this.notyf.success('Contraseña actualizada correctamente');
        this.onClose();
        this.logout()
      },
      error: (err) => {
        this.notyf.error(err.error.message || 'Error al cambiar la contraseña');

      },
    });
  }

    logout() {

    localStorage.removeItem('token');
    localStorage.removeItem('user');


    this.router.navigate(['/auth/login']);
  }
}
