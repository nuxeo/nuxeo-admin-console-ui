import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
import { BulkActionMonitoringComponent } from "./store/components/bulk-action-monitoring.component";
export const BulkActionMonitoringRoutes: Route[] = [
  {
    path: '',
    component: BulkActionMonitoringComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(BulkActionMonitoringRoutes)],
  exports: [RouterModule],
})
export class BulkActionMonitoringRoutingModule { }