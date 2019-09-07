  import { Component, OnInit } from '@angular/core';
  import {MeetupService} from '../meetup.service';
  import {Meetup} from '../meetup';
  
  @Component({
    selector: 'app-active-meetups',
    templateUrl: './active-meetups.component.html',
    styleUrls: ['./active-meetups.component.css']
  })
  
  export class ActiveMeetupsComponent implements OnInit {
  
  meetups: Meetup[];
  
  constructor(private meetupService: MeetupService) { }
  
    ngOnInit() {
      // navigator.geolocation.getCurrentPosition((position) => {
      //   this.locationX = position.coords.longitude;
      //   this.locationY = position.coords.latitude;
      // })
  }
  //   this.getMeetups();
  }
  
  // getMeetups(locationX, locationY): void {
  //   this.meetupService.getMeetups(locationX, locationY)
  //       .subscribe(meetups => (this.meetups = meetups))
  // }
  

