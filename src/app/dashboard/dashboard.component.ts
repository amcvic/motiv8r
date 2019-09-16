import { Component, OnInit } from '@angular/core';
import * as CanvasJS from './canvasjs.min';

import { MatDialog, MatDialogConfig } from '@angular/material';
import { NewMeetupComponent } from '../new-meetup/new-meetup.component';

import { MeetupService } from '../meetup.service';
import { Meetup } from '../meetup';


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
  graphData: Meetup[];

  chart: string[];
    
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    this.dialog.open(NewMeetupComponent, dialogConfig);
  }

  constructor(private dialog: MatDialog, private meetupService: MeetupService) { }

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
        this.displayedColumns = ['name', 'date', 'description'];
    // console.log(this.myMeets);
    this.dateTrim(this.myMeets);
    this.dataSource = this.myMeets;
      });
  };

  showGraphData():void {
    this.meetupService.getMeetups(this.locationX, this.locationY)
    .subscribe((response) => {
      console.log(response);
      this.graphData = (response);
      console.log(this.graphData);
      this.chart = []
    })
  };
    
  ngOnInit() {

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
