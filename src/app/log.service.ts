import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Log } from './log';
import { ExerciseResponse } from './exercise';
import { APIURL } from '../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token')})
  }

  private logUrl = '/log';
  private exerciseUrl = 'https://wger.de/api/v2/exercise/?page=';
  
  public currentLog: Log;
  public refreshLogs: boolean = false;

  editLog (workout: string, length: number, intensity: number, log: string): Observable<Log> {
    return this.http.put<Log>(APIURL+this.logUrl + '/' + this.currentLog.id, {name: workout, length: length, intensity: intensity, review: log}, this.httpOptions)
      .pipe(
        catchError(this.handleError<Log>('edit log'))
      )
  }

  createLog (name: string, date: string): Observable<Log> {
    return this.http.post<Log>(APIURL+this.logUrl, {name: name, date: date}, this.httpOptions)
      .pipe(
        catchError(this.handleError<Log>('create log'))
      );
  }

  getLogs (month: string, nextMonth: string): Observable<Log[]> {
    return this.http.post<Log[]>(APIURL+this.logUrl+'/getall', {minMonth: month, maxMonth: nextMonth}, this.httpOptions)
      .pipe(
        catchError(this.handleError<Log[]>('get logs'))
      )
  }

  getIdeas(): Observable<ExerciseResponse> {
    let randomNum: number = Math.floor(Math.random()*Math.floor(30));
    return this.http.get<ExerciseResponse>(this.exerciseUrl + randomNum, this.httpOptions)
      .pipe(
        catchError(this.handleError<ExerciseResponse>('get ideas'))
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