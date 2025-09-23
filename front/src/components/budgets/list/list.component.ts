import { FormComponent } from './../form/form.component';
import { Component, OnInit } from '@angular/core';
import { ListCommonComponent } from '../../common/list-common/list-common.component';
import { BudgetService } from '../../../services/budget/budget.service';
import { PaginationComponent } from '../../common/pagination/pagination.component';
import Swal from 'sweetalert2';

import { CommonModule } from '@angular/common';
import { Notyf } from 'notyf';
import { Router } from '@angular/router';
import { Budget } from '../../../models/budget/budget';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [ListCommonComponent, PaginationComponent, FormComponent, CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  private notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });

  budget: Budget = {
    nombre: '',
    descripcion: '',
    valor: 0,

  };
  presupuestos: any[] = [];
  total = 0;
  page = 1;
  limit = 3;
  totalPages = 0;
  idPresupuesto: string = '';

  modalVisible = false;
  modalMode: 'create' | 'edit' | 'view' = 'create';
  selectedBudget: any = null;
  link = '/crashflow/expense/list/';
  constructor(private budgetService: BudgetService, private router: Router) { }

  ngOnInit(): void {


    this.loadBudgets();
  }

 loadBudgets() {
  this.budgetService.getBudgets(this.page, this.limit).subscribe((res) => {
    this.presupuestos = res.budgets.map(b => ({
      ...b,
      link: `${this.link}${b.id}`
    }));
    this.total = res.total;
    this.totalPages = Math.ceil(this.total / this.limit);
  });
}


  acciones = [
    { key: 'detalle', label: 'Ver detalle', icon: '👁', color: 'text-purple-600', visible: true },
    { key: 'gestion', label: 'Gestion de gasto', icon: '⚙️', color: 'text-green-600', visible: true },
    { key: 'editar', label: 'Editar', icon: '✏', color: 'text-blue-600', visible: true },
    { key: 'eliminar', label: 'Eliminar', icon: '🗑', color: 'text-red-600', visible: true },

  ];


  handleAction(event: { key: string, item: any }) {
    this.idPresupuesto = event.item.id;
    this.link = event.item.link;
    console.log('Acción:', event.key, 'en presupuesto:', event.item);

    if (event.key === 'detalle') {
      this.openModal('view', event.item);
    } else if (event.key === 'editar') {
      this.openModal('edit', event.item);
      console.log('Editar presupuesto:', event.item);
    } else if (event.key === 'eliminar') {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteBudget();

        }
      });
    }
    if (event.key === 'gestion') {
      this.goToRoute();
     }
  }

  /*changePage(newPage: number) {
    if (newPage < 1 || newPage > Math.ceil(this.total / this.limit)) return;
    this.page = newPage;
    this.loadBudgets();
  }*/
  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadBudgets();
  }

  openModal(mode: 'create' | 'edit' | 'view', budget: any = null) {
    this.modalMode = mode;
    this.selectedBudget = budget;
    this.modalVisible = true;
  }

  saveBudget(budget: any) {


    this.budget = budget;
    if (this.modalMode === 'create') {

      this.createBudget();

    } else if (this.modalMode === 'edit') {
      console.log('entreee',);
      this.updateBudget();
    }
    this.closeModal();
  }

  closeModal() {
    this.modalVisible = false;
    this.selectedBudget = null;
  }

  createBudget() {
    this.budgetService.createBudget(this.budget).subscribe({
      next: (res) => {
        this.notyf.success('Presupuesto creado exitosamente');
        this.loadBudgets();
      },
      error: (err) => {
        console.error('Error creando presupuesto', err);
        this.notyf.error('Error creando presupuesto.');
      }
    });
  }

  updateBudget() {
    console.log('Actualizando presupuesto con ID:', this.idPresupuesto, this.budget);
    if (!this.idPresupuesto) return;

    this.budgetService.updateBudget(this.idPresupuesto, this.budget).subscribe({
      next: (res) => {
        this.notyf.success('Presupuesto actualizado exitosamente');
        this.loadBudgets();
      },
      error: (err) => {
        console.error('Error actualizando presupuesto', err);
        this.notyf.error('Error actualizando presupuesto.');
      }
    });
  }

  deleteBudget() {
    this.budgetService.deleteBudget(this.idPresupuesto).subscribe({
      next: (res) => {
        this.notyf.success('Presupuesto eliminado exitosamente');
        this.loadBudgets();
      },
      error: (err) => {
        console.error('Error eliminando presupuesto', err);
        this.notyf.error('Error eliminando presupuesto.');
      }
    });
  }

    goToRoute() {
      this.router.navigate([this.link]);

  }

}
