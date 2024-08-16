import { BulkActionMonitoringComponent } from './components/bulk-action-monitoring.component';
import { NgModule } from "@angular/core";
import { RouterModule, Route } from "@angular/router";

export const BulkActionMonitoringRoutes: Route[] = [
  {
    path: '',  // Default path for this module
    component: BulkActionMonitoringComponent,
  },
  {
    path: ':bulkActionId',  // Path with parameter
    component: BulkActionMonitoringComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(BulkActionMonitoringRoutes)],
  exports: [RouterModule],
})
export class BulkActionMonitoringRoutingModule { }