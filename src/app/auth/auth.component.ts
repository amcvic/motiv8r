import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor() { }

  private loginMode: boolean;

  signup(email: string, username: string, password: string): void {
    if (!email || !username || !password) {
      return;
    }
    console.log('signup fired');
  }

  login(username: string, password: string): void {
    if (!username || !password) {
      return;
    }
    console.log('login fired');
  }

  toggle(): void {
    this.loginMode = !this.loginMode;
  }

  ngOnInit() {
    this.loginMode = false;
  }

}
