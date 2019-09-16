import { Component, OnInit } from '@angular/core';
import * as CanvasJS from './canvasjs.min';

import { MatDialog, MatDialogConfig } from '@angular/material';
import { NewMeetupComponent } from '../new-meetup/new-meetup.component';
// import { PeriodicElement } from '../periodictable';
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
  
  constructor(private dialog: MatDialog, private meetupService: MeetupService) { }

  // elements: Meetup = [{
  //   date: '',
  //   locationX: 0,
  //   locationY: 0,
  //   name: '',
  //   description: '',
  //   attendees: [],
  //   prereqs: [],
  //   owner: 0
  // }]; 


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
    
  

  // openDialog() {
  //   const dialogConfig = new MatDialogConfig();

  //   dialogConfig.disableClose = true;
  //   dialogConfig.autoFocus = true;

  //   this.dialog.open(NewMeetupComponent, dialogConfig);
  // }

  ngOnInit() {
    // this.openDialog();

    // elements: this.myMeets = [
    //   {name: this.myMeets.name, date: this.myMeets.date, intensity: this.myMeets.description},
    // ];
    

    

    // ,{
    //   date: '',
    //   locationX: 0,
    //   locationY: 0,
    //   name: '',
    //   description: '',
    //   attendees: [],
    //   prereqs: [],
    //   owner: 0
    // }

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

      graphData: [{
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
    this.showGraphData()
    chart.render();
  }

}
