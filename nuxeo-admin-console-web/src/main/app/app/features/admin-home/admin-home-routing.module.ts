import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
import { AdminHomeComponent } from "../admin-home/components/admin-home.component"

export const AdminHomeRoutes: Route[] = [
  {
    path: '',
    component: AdminHomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(AdminHomeRoutes)],
  exports: [RouterModule],
})
export class AdminHomeRoutingModule { }
