export interface   BudgetResponse {
  budgets: Budget[];
  total: number;
  page: number;
  limit: number;
}

export interface Budget {
  _id?: string;
  nombre: string;
  descripcion?: string;
  valor: number;
  user?: string;
  createdAt?: string;
  updatedAt?: string;
}
