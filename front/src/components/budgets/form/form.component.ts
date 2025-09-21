import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
})
export class FormComponent implements OnChanges {
  @Input() visible = false;
  @Input() mode: 'create' | 'edit' | 'view' = 'create';
  @Input() budgetData: any = null;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(1)]], // obligatorio y mayor a 0
      descripcion: [''],
    });
  }

  ngOnChanges() {
    if (this.budgetData) {
      this.form.patchValue(this.budgetData);
    }

    if (this.mode === 'view') {
      this.form.disable();
    } else if (this.mode === 'create') {
      this.form.reset();
      this.form.enable();
    } else if (this.mode === 'edit') {
      this.form.enable();
    }

  }

  onClose() {
    this.close.emit();
  }

  onSave() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
