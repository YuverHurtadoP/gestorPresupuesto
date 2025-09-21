import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRegister } from '../../models/auth/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}


  register(user: UserRegister): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }


  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }
}
