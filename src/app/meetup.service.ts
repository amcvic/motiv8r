import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Meetup } from './meetup';

@Injectable({
  providedIn: 'root'
})
export class MeetupService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token')})
  }

  private meetupUrl = 'http://localhost:3000/meetup';

  submitMeetup (name: string, description: string, date: string, locationX: number, locationY: number, prereqs: string[]): Observable<Meetup> {
    return this.http.post<Meetup>(this.meetupUrl, {
      name: name,
      description: description,
      date: date,
      locationX: locationX,
      locationY: locationY,
      prereqs: prereqs
    }, this.httpOptions)
    .pipe(
      catchError(this.handleError<Meetup>('submit'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: T): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed`);
      return of(result as T);
    }
  }
}