import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Log } from './log';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token')})
  }

  private logUrl = 'http://localhost:3000/log';

  createLog (name: string, date: string): Observable<Log> {
    return this.http.post<Log>(this.logUrl, {name: name, date: date}, this.httpOptions)
      .pipe(
        catchError(this.handleError<Log>('create log'))
      );
  }

  getLogs (month: string): Observable<Log[]> {
    return this.http.post<Log[]>(this.logUrl+'/getall', {minMonth: '2019-09', maxMonth: '2019-10'}, this.httpOptions)
      .pipe(
        catchError(this.handleError<Log[]>('get logs'))
      )
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: T): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed`);
      return of(result as T);
    }
  }
}
