import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
export interface Budget {
  _id: string;
  nombre: string;
  valor: number;
  createdAt: string;
}

export interface BudgetResponse {
  budgets: Budget[];
  total: number;
  page: number;
  limit: number;
}
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
}
