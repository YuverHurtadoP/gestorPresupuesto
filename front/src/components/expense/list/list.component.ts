import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from '../../../services/expense/expense.service';
import { Expense, ExpenseDto } from '../../../models/expense/expense';
import { ListCommonComponent } from '../../common/list-common/list-common.component';
import { PaginationComponent } from '../../common/pagination/pagination.component';
import { FormComponent } from '../../budgets/form/form.component';
import { Notyf } from 'notyf';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    ListCommonComponent,
    PaginationComponent,
    FormComponent,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent implements OnInit {
  expenses: any[] = [];
  expenseWithBudget!: ExpenseDto;
  total = 0;
  page = 1;
  limit = 3;
  totalPages = 0;
  search = signal('');
  presupuestoId = '';
  idExpense = '';
  resumen: any;
  porcentaje: number = 0;

  modalVisible = false;
  modalMode: 'create' | 'edit' | 'view' = 'create';
  selectedExpense: any = null;
  private notyf = new Notyf({
    duration: 3000,
    position: { x: 'right', y: 'top' },
  });

  acciones = [
    {
      key: 'detalle',
      label: 'Ver detalle',
      icon: '👁',
      color: 'text-purple-600',
      visible: true,
    },
    {
      key: 'editar',
      label: 'Editar',
      icon: '✏',
      color: 'text-blue-600',
      visible: true,
    },
    {
      key: 'eliminar',
      label: 'Eliminar',
      icon: '🗑',
      color: 'text-red-600',
      visible: true,
    },
  ];

  constructor(
    private expenseService: ExpenseService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.presupuestoId = this.route.snapshot.paramMap.get('id') || '';
    this.loadExpenses();



  }
  grafica() {
    this.expenseService
      .getSummaryByBudget(this.presupuestoId)
      .subscribe((summary) => {
        this.resumen = summary;
        this.porcentaje = summary?.summary?.porcentaje


      });
  }

  loadExpenses(): void {
    this.expenseService
      .getExpense(this.presupuestoId, this.page, this.limit)
      .subscribe((res) => {
        this.expenses = res.expenses;
        this.total = res.total;
        this.totalPages = Math.ceil(this.total / this.limit);
         this.grafica()
      });
  }

  handleAction(event: { key: string; item: any }) {
    this.idExpense = event.item.id;

    if (event.key === 'detalle') {
      this.openModal('view', event.item);
    } else if (event.key === 'editar') {
      this.openModal('edit', event.item);
    } else if (event.key === 'eliminar') {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás revertir esto',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteExpense();
        }
      });
    }
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadExpenses();
  }

  openModal(mode: 'create' | 'edit' | 'view', expense: any = null) {
    this.modalMode = mode;
    this.selectedExpense = expense;
    this.modalVisible = true;
  }

  closeModal() {
    this.modalVisible = false;
    this.selectedExpense = null;
  }

  saveExpense(expense: any) {
    this.expenses = expense;
    console.log('expenses',this.expenses)

    this.expenseWithBudget = {
      ...expense,
      presupuestoId: this.presupuestoId,
    };
    if (this.modalMode === 'create') {
      this.createExpense();
    } else if (this.modalMode === 'edit') {
      this.updateExpense();
    }
    this.closeModal();
  }

  createExpense() {
    this.expenseService.createExpense(this.expenseWithBudget).subscribe({
      next: (res) => {
        this.notyf.success('Gasto creado exitosamente');
        this.loadExpenses();
      },
      error: (err) => {
        console.error('Error creando gasto', err);
        this.notyf.error(
          err.error.message +
          '. El presupuesto disponible es:' +
          err.error.disponible
        );
      },
    });
  }

  updateExpense() {
    if (!this.idExpense) return;

    this.expenseService.updateExpense(this.idExpense, this.expenses).subscribe({
      next: (res) => {
        this.notyf.success('Gasto actualizado exitosamente');
        this.loadExpenses();
      },
      error: (err) => {
        console.error('Error actualizando presupuesto', err);
        this.notyf.error(
          err.error.message +
          '. El presupuesto disponible es:' +
          err.error.disponible
        );
      },
    });
  }

  deleteExpense() {
    this.expenseService.deleteExpense(this.idExpense).subscribe({
      next: (res) => {
        this.notyf.success('Gasto eliminado exitosamente');
        this.loadExpenses();
      },
      error: (err) => {
        console.error('Error eliminando gasto', err);
        this.notyf.error('Error eliminando presupuesto.');
      },
    });
  }
}
