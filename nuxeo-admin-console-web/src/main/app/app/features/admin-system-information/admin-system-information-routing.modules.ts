import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
import { AdminSystemInformationComponent } from "./components/admin-system-information.component"

export const AdminSystemInformationRoutes: Route[] = [
  {
    path: '',
    component: AdminSystemInformationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(AdminSystemInformationRoutes)],
  exports: [RouterModule],
})
export class AdminSystemInformationRoutingModule { }
