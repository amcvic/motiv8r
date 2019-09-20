import { Component, OnInit } from '@angular/core';
import * as CanvasJS from './canvasjs.min';

import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBar,MatSnackBarModule} from '@angular/material/snack-bar';

import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { NewMeetupComponent } from '../new-meetup/new-meetup.component';

import { MeetupService } from '../meetup.service';

import { Meetup } from '../meetup';
import { MeetupDetailsComponent } from '../meetup-details/meetup-details.component';


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
    this.meetupService.editMode = false;
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialogRef: MatDialogRef<NewMeetupComponent> = this.dialog.open(NewMeetupComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      this.showDashResponse();
    })
  }

  constructor(private dialog: MatDialog, private meetupService: MeetupService, private snackBar: MatSnackBar) { }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 1000
    });
  }

  openDialogInEditMode(meetup: Meetup) {
    console.log(meetup);
    this.meetupService.currentMeetup = meetup;
    this.meetupService.editMode = true;
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialogRef: MatDialogRef<NewMeetupComponent> = this.dialog.open(NewMeetupComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      this.showDashResponse();
    })
  }
    
  showDashResponse():void {
    this.meetupService.getMeetups(this.locationX, this.locationY)
      .subscribe((response) => {
        this.myMeets = (response.filter((meetup) => {
          console.log(meetup.owner, +localStorage.getItem('userid'));
          return meetup.owner == +localStorage.getItem('userid');
        }));
        console.log(this.myMeets);
        this.displayedColumns = ['name', 'date', 'description', 'delete'];
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

  deleteMeetup(meetup): void {
    this.meetupService.deleteMeetup(meetup.id)
      .subscribe((response) => {
        console.log(response);
        this.showDashResponse();
      });
  }
    
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
