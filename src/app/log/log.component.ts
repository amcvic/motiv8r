import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';
import { LogService } from '../log.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {

  constructor(private authService: AuthService, private logService: LogService) { }

  private username: string;
  private points: number;

  getUser(id: number): void {
    this.authService.getUser(id)
      .subscribe((response) => {
        this.username = response.user.username;
        this.points = response.user.points;
      })
  }

  getLogs(month: string): void {
    this.logService.getLogs(month)
      .subscribe((response) => {
        console.log(response);
      })
  }

  ngOnInit() {
    this.getLogs('month');
    this.getUser(+localStorage.getItem('userid'));
  }

}
