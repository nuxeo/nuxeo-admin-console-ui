import { BulkActionMonitoringFormComponent } from './components/bulk-action-monitoring-form/bulk-action-monitoring-form.component';
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
export const BulkActionMonitoringRoutes: Route[] = [
  {
    path: '',
    component: BulkActionMonitoringFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(BulkActionMonitoringRoutes)],
  exports: [RouterModule],
})
export class BulkActionMonitoringRoutingModule { }