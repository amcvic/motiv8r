import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private authService: AuthService) { }

  public loginMode: boolean;

  signup(email: string, username: string, password: string): void {
    if (!email || !username || !password) {
      return;
    }
    this.authService.signup(email, username, password)
      .subscribe((response) => {
        if (response.sessionToken) {
          localStorage.setItem('token', response.sessionToken);
          localStorage.setItem('userid', ""+response.user.id);
          localStorage.setItem('username', response.user.username);
          this.authService.currentUser = response.user;
          console.log(this.authService.currentUser);
          console.log(`signed up & loggin in as user: ${response.user.username}`);
          this.authService.router.navigate(['/dashboard']);
        } else {
          console.log('error happened');
        }
      })
  }

  login(username: string, password: string): void {
    if (!username || !password) {
      return;
    }
    this.authService.login(username, password)
      .subscribe((response) => {
        localStorage.setItem('token', response.sessionToken);
        localStorage.setItem('userid', ""+response.user.id);
        localStorage.setItem('username', response.user.username);
        this.authService.currentUser = response.user;
        console.log(this.authService.currentUser);
        console.log(`logged in as user: ${response.user.username}`);
        this.authService.router.navigate(['/']);
      })
  }

  toggle(): void {
    this.loginMode = !this.loginMode;
  }

  ngOnInit() {
    this.loginMode = false;
  }

}