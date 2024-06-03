import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BulkActionMonitoringComponent } from "./components/bulk-action-monitoring.component";
import { BulkActionMonitoringRoutingModule } from "../bulk-action-monitoring/bulk-action-monitoring-routing.module"
@NgModule({
  declarations: [BulkActionMonitoringComponent],
  imports: [CommonModule, BulkActionMonitoringRoutingModule],
})
export class BulkActionMonitoringModule { }
