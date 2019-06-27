import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './components/map/map';
import { AuthService } from './auth/auth.service';
import { CanLoadAdminService } from './auth/canLoadAdmin';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { LoginComponent } from './auth/login';
import { AngularFireAuthModule } from '@angular/fire/auth';

const redirectUnauthorizedToLogin = redirectUnauthorizedTo(['login']);

const routes: Routes = [
  {
    path: 'map',
    component: MapComponent
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/module').then(mod => mod.AdminModule),
    canLoad: [
       CanLoadAdminService
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: 'map'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true }),
    AngularFireAuthModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
