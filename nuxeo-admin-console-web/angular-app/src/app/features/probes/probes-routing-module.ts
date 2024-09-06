import { ProbesComponent } from './probes.component';
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
export const ProbesRoutes: Route[] = [
  {
    path: '',
    component: ProbesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ProbesRoutes)],
  exports: [RouterModule],
})
export class ProbesRoutingModule { }