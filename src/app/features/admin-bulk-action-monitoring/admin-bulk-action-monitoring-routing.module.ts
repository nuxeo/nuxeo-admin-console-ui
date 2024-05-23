import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
import { AdminBulkActionMonitoringComponent } from "./components/admin-bulk-action-monitoring.component"
export const AdminBulkActionMonitoringRoutes: Route[] = [
  {
    path: '',
    component: AdminBulkActionMonitoringComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(AdminBulkActionMonitoringRoutes)],
  exports: [RouterModule],
})
export class AdminBulkActionMonitoringRoutingModule { }
