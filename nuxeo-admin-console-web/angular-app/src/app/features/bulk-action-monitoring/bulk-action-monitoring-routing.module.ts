import { BulkActionMonitoringComponent } from "./components/bulk-action-monitoring/bulk-action-monitoring.component";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
export const BulkActionMonitoringRoutes: Route[] = [
  {
    path: "",
    component: BulkActionMonitoringComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(BulkActionMonitoringRoutes)],
  exports: [RouterModule],
})
export class BulkActionMonitoringRoutingModule {}
