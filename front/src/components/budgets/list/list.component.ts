import { FormComponent } from './../form/form.component';
import { Component, OnInit } from '@angular/core';
import { ListCommonComponent } from '../../common/list-common/list-common.component';
import { BudgetService } from '../../../services/budget/budget.service';
import { PaginationComponent } from '../../common/pagination/pagination.component';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [ListCommonComponent, PaginationComponent, FormComponent,CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  presupuestos: any[] = [];
  total = 0;
  page = 1;
  limit = 3;
  totalPages = 0;

   modalVisible = false;
  modalMode: 'create' | 'edit' | 'view' = 'create';
  selectedBudget: any = null;
  constructor(private budgetService: BudgetService) { }

  ngOnInit(): void {


    this.loadBudgets();
  }

  loadBudgets() {
    this.budgetService.getBudgets(this.page, this.limit).subscribe((res) => {
      this.presupuestos = res.budgets;
      this.total = res.total;
      this.totalPages = Math.ceil(this.total / this.limit);
    });
  }

  acciones = [
    { key: 'detalle', label: 'Ver detalle', icon: '👁', color: 'text-purple-600', visible: true },
    { key: 'agregar', label: 'Agregar gasto', icon: '➕', color: 'text-green-600', visible: true },
    { key: 'editar', label: 'Editar', icon: '✏', color: 'text-blue-600', visible: true },
    { key: 'eliminar', label: 'Eliminar', icon: '🗑', color: 'text-red-600', visible: true },

  ];

  handleAction(event: { key: string, item: any }) {
    console.log('Acción:', event.key, 'Item:', event.item);
    if (event.key === 'detalle') {
      this.openModal('view', event.item);
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
    if (this.modalMode === 'create') {
      this.presupuestos.push({ ...budget, id: Date.now() });
    } else if (this.modalMode === 'edit') {
      const index = this.presupuestos.findIndex((p) => p.id === this.selectedBudget.id);
      if (index > -1) this.presupuestos[index] = { ...this.selectedBudget, ...budget };
    }
    this.closeModal();
  }

    closeModal() {
    this.modalVisible = false;
    this.selectedBudget = null;
  }

}
