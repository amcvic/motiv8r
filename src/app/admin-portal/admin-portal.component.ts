import { Component, OnInit } from '@angular/core';
import { User } from '../user';

@Component({
  selector: 'app-admin-portal',
  templateUrl: './admin-portal.component.html',
  styleUrls: ['./admin-portal.component.css']
})
export class AdminPortalComponent implements OnInit {

  users: User[];
  dataSource: User[];
  displayedColumns: string[];

  constructor() { }

  // showUsers():void {
  //   this.getUsers()
  //     .subscribe((response) => { 
  //       this.users = (response);
  //         console.log(this.users) });

  //       this.displayedColumns= ['userid', 'username'];
  //       this.dataSource = this.users;
  //     }; 

      ngOnInit() {
        // this.showUsers()
      };
}
