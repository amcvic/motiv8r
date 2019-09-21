import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ActiveMeetupsComponent } from './active-meetups/active-meetups.component';
import { LogComponent } from './log/log.component';
import { AdminPortalComponent } from './admin-portal/admin-portal.component';

import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'admin', component: AdminPortalComponent},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'meetups', component: ActiveMeetupsComponent, canActivate: [AuthGuard] },
  { path: 'log', component: LogComponent, canActivate: [AuthGuard] },
  { path: '**', component: DashboardComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }