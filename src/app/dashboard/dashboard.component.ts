import { Component, OnInit } from '@angular/core';
import * as CanvasJS from './canvasjs.min';

import { MatDialog, MatDialogConfig } from '@angular/material';
import { NewMeetupComponent } from '../new-meetup/new-meetup.component';
import { PeriodicElement } from '../periodictable';
import { MeetupService } from '../meetup.service';
// import {MatDialog, MatDialogConfig } from '@angular/material';
// import { NewMeetupComponent } from '../new-meetup/new-meetup.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  locationX: number;
  locationY: number;
    
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    this.dialog.open(NewMeetupComponent, dialogConfig);
  }

  //fetch GET from DB

  // ELEMENT_DATA: PeriodicElement[] = [
  //   {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  //   {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  //   {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  //   {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  //   {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  //   {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  //   {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  //   {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  //   {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  //   {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  // ];
  
  // displayedColumns = ['position', 'name', 'weight', 'symbol'];
  // dataSource = this.ELEMENT_DATA;
  
  constructor(private meetupService: MeetupService) { }

  showDashResponse():void {
    this.meetupService.getMeetups(this.locationX, this.locationY)
      .subscribe((response) => {
        console.log(response);
      });
    // this.DashService.getDashResponse()
    // // resp is of type `HttpResponse<Config>`
    // // .subscribe(resp => {
    // //   //display its headers
    // //   const keys = resp.headers.keys();
    // //   this.headers = keys.map(key => 
    // //     `${key}: ${resp.headers.get(key)}`);)

    //     //access the body directly, which is typed as 'Dash'.
    // //     this.config = {resp.body}
    // // }

    // .subscribe((data: Dash) => this.dash = {
    //   motiv8rUrl: data['motiv8rUrl'],
    //   textfile: data['textfile']
    // },
    // error => this.error = error //error path
    // );
    
  }

  // openDialog() {
  //   const dialogConfig = new MatDialogConfig();

  //   dialogConfig.disableClose = true;
  //   dialogConfig.autoFocus = true;

  //   this.dialog.open(NewMeetupComponent, dialogConfig);
  // }

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

      //fetch GET and .map() through data to find info.

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
