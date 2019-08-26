import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from './user';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public sessionToken: string;
  public currentUser: User;

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  private signupUrl = 'http://localhost:3000/user/signup';
  private loginUrl = 'http://localhost:3000/user/login';

  login (username: string, password: string): Observable<Auth> {
    return this.http.post<Auth>(this.loginUrl, {username: username, password: password}, this.httpOptions)
    .pipe(
      catchError(this.handleError<Auth>('login'))
    );
  }

  signup (email: string, username: string, password: string): Observable<Auth> {
    return this.http.post<Auth>(this.signupUrl, {email: email, username: username, password: password}, this.httpOptions)
    .pipe(
      catchError(this.handleError<Auth>('signup'))
    );
  }

  logout(): void {
    localStorage.clear();
    this.sessionToken = null;
    this.currentUser = null;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: T): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error}`);
      return of(result as T);
    }
  }
}
