import { Component, OnInit, Renderer2 } from '@angular/core';

import { AuthService } from '../auth.service';
import { LogService } from '../log.service';
import { Log } from '../log';

import { MatDialog, MatDialogConfig } from '@angular/material';
import { MatCalendarCellCssClasses } from '@angular/material';
import { LogDetailsComponent } from '../log-details/log-details.component';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {

  constructor(private dialog: MatDialog, private renderer: Renderer2, private authService: AuthService, private logService: LogService) { }

  private username: string;
  private points: number;

  private dates: string[] = [];
  private logs: Log[] = [];
  private calDays: HTMLCollectionOf<Element>;
  private calNums: HTMLCollectionOf<Element>;
  private match: Log;

  openDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    this.dialog.open(LogDetailsComponent, dialogConfig);
  }

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
        this.logs = response;
        this.loadCalendar();
        // if (this.calDays) {
        //   var datesArray: string[] = this.dates;
        //   Array.from(this.calDays).forEach((el, i) => {
        //     let element: HTMLElement = el as HTMLElement;
        //     element.click();//logs dates in array in db readable format

        //     this.match = this.logs.find(function(el) {
        //       return el.date.substring(0,10) === datesArray[i].substring(0,10);
        //     });
        //     if (this.match) {
        //       this.calNums[i].className += ' mat-calendar-body-selected';
        //     }
        //   });
        // }
      });
  }

  loadCalendar() {
    this.calDays = document.getElementsByClassName('mat-calendar-body-cell');
    this.calNums = document.getElementsByClassName('mat-calendar-body-cell-content');
  }

  monthSelected(date) {
    console.log('hello');
    console.log(date);
  }

  dateSelected(date: Date) {

    let currentDate: string = (date.getFullYear() + '-' + 
      ("0" + (+date.getMonth()+1)).slice(-2) + '-' + 
      ("0" + (date.getDate())).slice(-2) + ' 00:00:00-04');

    if (this.logService.refreshLogs) {
      this.getLogs('month');
      this.logService.refreshLogs = false;
    }

    this.logs.forEach((el, i) => {
      if (currentDate.substring(0,10) === el.date.substring(0,10)) {
        console.log('found log at', el.name);
        this.logService.currentLog = el;
        this.openDialog();
      }
    });

  }

  ngOnInit() {
    this.getLogs('month');
    this.getUser(+localStorage.getItem('userid'));
  }

  ngAfterViewInit() {
    let buttons = document.querySelectorAll('mat-calendar mat-calendar-header button');
 
    if (buttons) {
      Array.from(buttons).forEach(button => {
        this.renderer.listen(button, "click", () => {
          this.dates = [];
          this.loadCalendar();
          console.log('Arrow button clicked');
        });
      });
    }
  }

}
