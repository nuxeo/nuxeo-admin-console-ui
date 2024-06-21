import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
import { SystemInformationComponent } from "./components/system-information.component"

export const SystemInformationRoutes: Route[] = [
  {
    path: '',
    component: SystemInformationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(SystemInformationRoutes)],
  exports: [RouterModule],
})
export class SystemInformationRoutingModule { }
