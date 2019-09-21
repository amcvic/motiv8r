import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ActiveMeetupsComponent } from './active-meetups/active-meetups.component';
import { LogComponent } from './log/log.component';
import { AdminPortalComponent } from './admin-portal/admin-portal.component';

const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'meetups', component: ActiveMeetupsComponent},
  { path: 'log', component: LogComponent },
  { path: 'admin', component: AdminPortalComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }