import { Component, OnInit } from '@angular/core';
import * as CanvasJS from './canvasjs.min';

import { MatDialog, MatDialogConfig } from '@angular/material';
import { NewMeetupComponent } from '../new-meetup/new-meetup.component';

import { MeetupService } from '../meetup.service';
import { Meetup } from '../meetup';

import { LogService } from '../log.service';
import { Log } from '../log';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  locationX: number;
  locationY: number;

  myMeets: Meetup[];

  displayedColumns: string[];
  dataSource: Meetup[];
  graphData: Log[];

  chart: Log[];
  
  
    
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    this.dialog.open(NewMeetupComponent, dialogConfig);
  }

  constructor(private dialog: MatDialog, private meetupService: MeetupService, private logService: LogService) { }

  private logs: Log[] = [];
  private month: string = '';
  private nextMonth: string = '';

  dateTrim(myMeets) {
    //modify the yyyy/mo/day format to populate on the page.
    for(let i = 0; i < myMeets.length; i++) {
      myMeets[i].date = myMeets[i].date.substring(0, 10);
      console.log(myMeets[i].date);
    }
  };
    
  showDashResponse():void {
    this.meetupService.getMeetups(this.locationX, this.locationY)
      .subscribe((response) => {
        // console.log(response);
        this.myMeets = (response);
        console.log(this.myMeets);
        this.myMeets = this.myMeets.filter(function(meetup) {
          console.log(meetup);
          if(meetup) {
            var dt = new Date();
            var df = new Date(meetup.date);
            if(df.getTime() > dt.getTime())
              return df;
            }
          });
        this.displayedColumns = ['name', 'date', 'description'];
    // console.log(this.myMeets);
    this.dateTrim(this.myMeets);
    // this.myMeets = (response);
        
    // const now = Date.now();
    // const futureDates = this.dateTrim.filter(date => {
    //   return date && (new Date(date)).getTime() > now;
    // });
    // console.log(futureDates.length);
    this.dataSource = this.myMeets;
      });
  };

  showGraphData():void {
    console.log(this.month, this.nextMonth);
    this.logService.getLogs(this.month, this.nextMonth)
    .subscribe((response) => {
      console.log(response);
      this.graphData = (response);
      // console.log(this.graphData);
      this.chart = []
    })
  };
    
  ngOnInit() {

    let currentDate: Date = new Date()

    // convertToDateTimeString(date: Date): string {
    //   return (date.getFullYear() + '-' + 
    //   ("0" + (+date.getMonth()+1)).slice(-2) + '-' + 
    //   ("0" + (date.getDate())).slice(-2) + ' 00:00:00-04');
    // }

    this.month = currentDate.getFullYear() + '-' +
      ("0" + (+currentDate.getMonth()+1)).slice(-2);
    this.nextMonth = currentDate.getFullYear() + '-' +
    ("0" + (+currentDate.getMonth()+2)).slice(-2);

    console.log('this month', this.month, 'next month', this.nextMonth)

    // console.log(("0"+(currentDate.getMonth()+1)).slice(-2) + '-' + "0" + (currentDate.getDate())).slice(-2)));

    navigator.geolocation.getCurrentPosition((position) => {
      this.locationX = position.coords.longitude;
      this.locationY = position.coords.latitude;
      console.log(this.locationX, this.locationY);
      this.showDashResponse();
    })
    let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Meetup Activity"
      },


      graphData: [{
        type: "column",
        dataPoints: [
          { y: 1, label: "Week 1" },
          { y: 2, label: "Week 2" },
          { y: 3, label: "Week 3" },
          { y: 4, label: "Week 4" },
          { y: 5, label: "Week 5" },
          { y: 6, label: "Week 6" },
        ]
      }]
    });
    this.showGraphData()
    chart.render();
  }

}
