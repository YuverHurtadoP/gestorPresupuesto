import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { BudgetResponse, Budget } from '../../models/budget/budget';




@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private apiUrl = environment.apiUrl+'/budgets';

  constructor(private http: HttpClient) {}

  getBudgets(page: number = 1, limit: number = 5, search: string = ''): Observable<BudgetResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('search', search);

    return this.http.get<BudgetResponse>(this.apiUrl, { params });
  }

  createBudget(budget: Budget): Observable<{ message: string; budget: Budget }> {
    return this.http.post<{ message: string; budget: Budget }>(
      `${this.apiUrl}/create`,
      budget
    );
  }

    updateBudget(id: string, budget: Partial<Budget>): Observable<{ message: string; budget: Budget }> {
    return this.http.put<{ message: string; budget: Budget }>(
      `${this.apiUrl}/${id}`,
      budget
    );
  }

    deleteBudget(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
