import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BudgetResponse } from '../../models/budget/budget';
import { Expense, ExpenseDto, ExpenseResponse } from '../../models/expense/expense';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private apiUrl = environment.apiUrl + '/expenses';

  constructor(private http: HttpClient) { }



  getExpense(
    presupuestoId: string,
    page: number = 1,
    limit: number = 10,
    search: string = ''
  ): Observable<ExpenseResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit)
      .set('search', search);

    return this.http.get<ExpenseResponse>(
      `${this.apiUrl}/${presupuestoId}`,
      { params }
    );
  }

   createExpense(expense: ExpenseDto): Observable<{ message: string; expense: ExpenseDto }> {
      return this.http.post<{ message: string; expense: ExpenseDto }>(
        `${this.apiUrl}/create`,
        expense
      );
    }

    updateExpense(id: string, expense: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, expense);
  }

   deleteExpense(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
