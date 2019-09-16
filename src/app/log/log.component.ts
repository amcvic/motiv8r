import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';

import { AuthService } from '../auth.service';
import { LogService } from '../log.service';
import { Log } from '../log';

import { MatDialog, MatDialogConfig, MatCalendar } from '@angular/material';
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

  private logs: Log[] = [];
  private currentMonth: string = '';
  private nextMonth: string = '';

  @ViewChild(MatCalendar, {static: false}) calendar: MatCalendar<Date>;

  openDialog(): void {
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

  getLogs(month: string, nextMonth: string): void {
    this.logService.getLogs(month, nextMonth)
      .subscribe((response) => {
        this.logs = response;
        this.calendar.updateTodaysDate();
      });
  }

  dateClass(): MatCalendarCellCssClasses {
    return (date: Date): MatCalendarCellCssClasses => {
      return this.logs.map(
        log => new Date(log.date)
      ).some(d => d.getDate() === date.getDate()) ? 'special-date' : '';
    }
  }

  monthSelected(date): void {
    this.currentMonth = this.convertToDateTimeString(date).substring(0,7);
    this.nextMonth = date.getFullYear()+"-"+("0"+(+date.getMonth()+2)).slice(-2);
    this.getLogs(this.currentMonth, this.nextMonth);
  }

  dateSelected(date: Date): void {

    let currentDate: string = this.convertToDateTimeString(date);

    //refreshes the local logs in case a user submits and then tries
    //to view a log within the same calendar view
    if (this.logService.refreshLogs) {
      this.getLogs(this.currentMonth, this.nextMonth);
      this.logService.refreshLogs = false;
    }

    this.logs.forEach((el, i) => {
      if (currentDate.substring(0,10) === el.date.substring(0,10)) {
        this.logService.currentLog = el;
        this.openDialog();
      }
    });

  }

  convertToDateTimeString(date: Date): string {
    return (date.getFullYear() + '-' + 
    ("0" + (+date.getMonth()+1)).slice(-2) + '-' + 
    ("0" + (date.getDate())).slice(-2) + ' 00:00:00-04');
  }

  ngOnInit() {
    this.currentMonth = this.convertToDateTimeString(new Date()).substring(0,7);
    this.nextMonth = (new Date()).getFullYear()+"-"+("0"+(+(new Date()).getMonth()+2)).slice(-2);
    this.getLogs(this.currentMonth, this.nextMonth);
    this.getUser(+localStorage.getItem('userid'));
  }

  ngAfterViewInit() {
    let buttons = document.querySelectorAll('mat-calendar mat-calendar-header button');
 
    if (buttons) {
      Array.from(buttons).forEach(button => {
        this.renderer.listen(button, "click", () => {
          this.currentMonth = this.convertToDateTimeString(this.calendar.activeDate).substring(0,7);
          this.nextMonth = this.calendar.activeDate.getFullYear()+"-"+("0"+(+this.calendar.activeDate.getMonth()+2)).slice(-2);
          this.getLogs(this.currentMonth, this.nextMonth);
        });
      });
    }
  }

}
