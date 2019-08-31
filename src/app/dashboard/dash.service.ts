import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DashService {
  constructor(private http: HttpClient) { }
}