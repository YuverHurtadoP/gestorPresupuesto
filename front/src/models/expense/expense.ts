
export interface   ExpenseResponse {
  expenses: Expense[];
  total: number;
  page: number;
  limit: number;
}

export interface Expense {
  _id?: string;
  nombre: string;
  descripcion?: string;
  valor: number;
  user?: string;
  createdAt?: string;
  updatedAt?: string;
  presupuesto?: string;

}


export interface ExpenseDto {
  nombre: string;
  descripcion: string;
  valor: number;
  presupuestoId: string;
}
