import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './components/map/map';

const routes: Routes = [
  {
    path: 'map',
    component: MapComponent
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/module').then(mod => mod.AdminModule)
  },
  {
    path: '**',
    redirectTo: 'map'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
