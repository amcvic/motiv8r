import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from './user';
import { Auth } from './auth';
import { UserResponse } from './user';
import { APIURL } from '../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, public router: Router) { }

  public sessionToken: string;
  public currentUser: User;

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  private signupUrl = '/user/signup';
  private loginUrl = '/user/login';
  private userUrl = '/user/';

  login (username: string, password: string): Observable<Auth> {
    return this.http.post<Auth>(APIURL+this.loginUrl, {username: username, password: password}, this.httpOptions)
    .pipe(
      catchError(this.handleError<Auth>('login'))
    );
  }

  signup (email: string, username: string, password: string): Observable<Auth> {
    return this.http.post<Auth>(APIURL+this.signupUrl, {email: email, username: username, password: password}, this.httpOptions)
    .pipe(
      catchError(this.handleError<Auth>('signup'))
    );
  }

  logout(): void {
    localStorage.clear();
    this.sessionToken = null;
    this.currentUser = null;
  }

  getUser(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(APIURL+this.userUrl + id, this.httpOptions)
      .pipe(
        catchError(this.handleError<UserResponse>('get user'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: T): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error}`);
      return of(result as T);
    }
  }
}
