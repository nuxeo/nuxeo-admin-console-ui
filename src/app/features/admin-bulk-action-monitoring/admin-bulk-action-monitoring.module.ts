import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminBulkActionMonitoringComponent } from "./components/admin-bulk-action-monitoring.component";
import { AdminBulkActionMonitoringRoutingModule } from "./admin-bulk-action-monitoring-routing.module"
@NgModule({
  declarations: [AdminBulkActionMonitoringComponent],
  imports: [CommonModule, AdminBulkActionMonitoringRoutingModule],
})
export class AdminBulkActionMonitoringModule { }
