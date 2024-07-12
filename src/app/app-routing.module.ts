import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { AuthGuard } from './authentication/_auth/auth.guard';
import { MainComponent } from './pages/main/main.component';
import { LiveComponent } from './pages/live/live.component';
import { UsersComponent } from './pages/users/users.component';
import { TrajectoryComponent } from './pages/trajectory/trajectory.component';
import { EventsComponent } from './pages/events/events.component';
import { ZonesComponent } from './pages/zones/zones.component';
import { ObjectsComponent } from './pages/objects/objects.component';
import { LoginComponent } from './authentication/login/login.component';

const rootconfig: Route[] = [
  // { path: 'admin', loadChildren: () => import('../app/admin/admin.module').then(m => m.AdminModule), canActivate: [AuthGuard], data: { roles: ['Admin'] } },
  // { path: '', loadChildren: () => import('../app/app.module').then(m => m.AppModule), canActivate: [AuthGuard], data: { roles: ['User', 'Admin'] } },

  {
    path: '', component: MainComponent, children: [
      { path: '', pathMatch: 'full', redirectTo: 'live' },
      { path: 'live', component: LiveComponent },
      { path: 'objects', component: ObjectsComponent },
      { path: 'users', component: UsersComponent },
      { path: 'events', component: EventsComponent },
      { path: 'zones', component: ZonesComponent },
      { path: 'trajectory', component: TrajectoryComponent }
    ], canActivate: [AuthGuard], data: { roles: ['Admin', 'User'] }
  },
  
  { path: 'login', loadChildren: () => import('../app/authentication/authentication.module').then(m => m.AuthenticationModule) }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(rootconfig)
  ]
})
export class AppRoutingModule { }
