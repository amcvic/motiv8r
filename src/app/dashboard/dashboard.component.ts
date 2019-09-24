import { Component, OnInit } from '@angular/core';
import * as CanvasJS from './canvasjs.min';

import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBar,MatSnackBarModule} from '@angular/material/snack-bar';

import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { NewMeetupComponent } from '../new-meetup/new-meetup.component';

import { MeetupService } from '../meetup.service';

import { Meetup } from '../meetup';
import { MeetupDetailsComponent } from '../meetup-details/meetup-details.component';

import { LogService } from '../log.service';
import { Log } from '../log';
import { Logs } from 'selenium-webdriver';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  locationX: number;
  locationY: number;

  week1: number;
  week2: number;
  week3: number;
  week4: number;

  myMeets: Meetup[];

  displayedColumns: string[];
  dataSource: Meetup[];
  graphData: string[];
    
  openDialog() {
    this.meetupService.editMode = false;
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialogRef: MatDialogRef<NewMeetupComponent> = this.dialog.open(NewMeetupComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      this.showDashResponse();
      this.showGraphData();
    })
  }

  constructor(private dialog: MatDialog, private meetupService: MeetupService, private logService: LogService) { }

  private logs: Log[] = [];
  private month: string = '';
  private nextMonth: string = '';


  openDialogInEditMode(meetup: Meetup) {
    this.meetupService.currentMeetup = meetup;
    this.meetupService.editMode = true;
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialogRef: MatDialogRef<NewMeetupComponent> = this.dialog.open(NewMeetupComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      this.showDashResponse();
      this.showGraphData();
    })
  }
    
  showDashResponse():void {
    this.meetupService.getMeetups(this.locationX, this.locationY)
      .subscribe((response) => {
        this.myMeets = (response.filter((meetup) => {
          return meetup.owner == +localStorage.getItem('userid');
        }));
        this.myMeets = this.myMeets.filter(function(meetup) {
          if(meetup) {
            var dt = new Date();
            var df = new Date(meetup.date);
            if(df.getTime() > dt.getTime())
              return df;
            }
        });
        this.displayedColumns = ['name', 'date', 'description', 'delete'];
        this.dataSource = this.myMeets;
      });
  };

  showGraphData():void {
    this.logService.getLogs(this.month, this.nextMonth)
    .subscribe((response) => {
      response.filter((log) => {
        return log.owner == +localStorage.getItem('userid');
      }).forEach((element, i) => {
        let day = +element.date.substring(8,10);
        if (day > 0 && day <= 7 ) {
          this.week1++;
        } else if (day > 7 && day <= 14) {
          this.week2++;
        } else if (day > 14 && day <= 21) {
          this.week3++;
        } else if (day > 21) {
          this.week4++;
        }
      });
      this.displayChart();
    });
  };

  deleteMeetup(meetup): void {
    this.meetupService.deleteMeetup(meetup.id)
      .subscribe((response) => {
        this.showDashResponse();
      });
  }
    
  ngOnInit() {

    this.week1 = 0;
    this.week2 = 0;
    this.week3 = 0;
    this.week4 = 0;

    let currentDate: Date = new Date();

    this.month = currentDate.getFullYear() + '-' +
      ("0" + (+currentDate.getMonth()+1)).slice(-2);
    this.nextMonth = currentDate.getFullYear() + '-' +
    ("0" + (+currentDate.getMonth()+2)).slice(-2);
    if (this.nextMonth.substring(5,7) == '13') {
      this.nextMonth = (+this.nextMonth.substring(0,4)+1) + '-01';
    }

    navigator.geolocation.getCurrentPosition((position) => {
      this.locationX = position.coords.longitude;
      this.locationY = position.coords.latitude;
      this.showDashResponse();
    });
    this.showGraphData();
 
  }

  displayChart(): void {
    let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      theme: "light2",
      exportEnabled: true,
      title: {
        text: "Meetup Activity"
      },
      axisY:{
        includeZero: true
      },
      
      data: [{
        type: "line",
        dataPoints: [
            {y: this.week1, label: 'Week 1'},
            {y: this.week2, label: 'Week 2'},
            {y: this.week3, label: 'Week 3'},
            {y: this.week4, label: 'Week 4'}
        ]
      }]
    });
    
    chart.render();


  }

}
