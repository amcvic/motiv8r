import { Component, OnInit } from '@angular/core';
import * as CanvasJS from './canvasjs.min';

import { MatDialog, MatDialogConfig } from '@angular/material';
import { NewMeetupComponent } from '../new-meetup/new-meetup.component';
import { PeriodicElement } from '../periodictable';
import { MeetupService } from '../meetup.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  locationX: number;
  locationY: number;

  constructor(private dialog: MatDialog, private meetupService: MeetupService) { }
    
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    this.dialog.open(NewMeetupComponent, dialogConfig);
  }
  
  showDashResponse():void {
    this.meetupService.getMeetups(this.locationX, this.locationY)
      .subscribe((response) => {
        console.log(response);
      });
    
  }

  ngOnInit() {
    // this.openDialog();
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

      data: [{
        type: "column",
        dataPoints: [
          { y: 1, label: "Week 1" },
          { y: 2, label: "Week 2" },
          { y: 3, label: "Week 3" },
          { y: 4, label: "Week 4" },
          { y: 5, label: "Week 5" },
          { y: 6, label: "Week 6" },
          // { y: 95, label: "Week 5" },
          // { y: 68, label: "Week 6" },
          // { y: 28, label: "Week 7" },
          // { y: 34, label: "Week 8" },
          // { y: 14, label: "Week 9" }
        ]
      }]
    });
    chart.render();
  }

}
