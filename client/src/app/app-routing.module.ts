import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './components/map/map';

const routes: Routes = [
  {
    path: 'map',
    component: MapComponent
  },
  {
    path: '**',
    redirectTo: 'map'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
