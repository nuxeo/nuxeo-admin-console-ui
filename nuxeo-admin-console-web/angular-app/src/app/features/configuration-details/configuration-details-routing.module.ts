import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationDetailsComponent } from './configuration-details.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationDetailsRoutingModule { }
