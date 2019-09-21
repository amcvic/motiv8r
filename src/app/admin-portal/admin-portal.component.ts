import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin-portal',
  templateUrl: './admin-portal.component.html',
  styleUrls: ['./admin-portal.component.css']
})
export class AdminPortalComponent implements OnInit {

  users: User[];
  dataSource: User[];
  displayedColumns: string[];

  constructor(private authService: AuthService) { }

  showUsers():void {
    this.authService.getAllUsers()
      .subscribe((response) => { 
        this.users = (response);
        console.log(this.users);
        this.displayedColumns= ['userid', 'username', 'delete'];
        this.dataSource = this.users;
      });
  }; 

  deleteUser(user): void {
    this.authService.deleteUser(user.id)
      .subscribe((response) => {
        console.log(response);
        this.showUsers();
      });
  }

  ngOnInit() {
    this.showUsers()
  };
}
