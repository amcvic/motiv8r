import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Meetup } from './meetup';
import { APIURL } from '../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MeetupService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token')})
  }

  private meetupUrl = '/meetup';

  submitMeetup (name: string, description: string, date: string, locationX: number, locationY: number, prereqs: string[]): Observable<Meetup> {
    return this.http.post<Meetup>(APIURL+this.meetupUrl, {
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

  getMeetups(locationX: number, locationY: number): Observable<Meetup[]>{
      return this.http.post<Meetup[]>(APIURL+this.meetupUrl + '/getall', {locationX: locationX, locationY: locationY}, this.httpOptions)
        .pipe(catchError(this.handleError<Meetup[]>('get meetups')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: T): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed`);
      return of(result as T);
    }
  }
}