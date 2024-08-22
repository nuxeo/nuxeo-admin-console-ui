import { BulkActionMonitoringDetailsComponent } from "./components/bulk-action-monitoring/bulk-action-monitoring-result/bulk-action-monitoring-details/bulk-action-monitoring-details.component";
import { BulkActionMonitoringSummaryComponent } from "./components/bulk-action-monitoring/bulk-action-monitoring-result/bulk-action-monitoring-summary/bulk-action-monitoring-summary.component";
import { BulkActionMonitoringResultComponent } from "./components/bulk-action-monitoring/bulk-action-monitoring-result/bulk-action-monitoring-result.component";
import { BulkActionMonitoringFormComponent } from "./components/bulk-action-monitoring/bulk-action-monitoring-form/bulk-action-monitoring-form.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { BulkActionMonitoringRoutingModule } from "./bulk-action-monitoring-routing.module";
import { MatButtonModule } from "@angular/material/button";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  HyFormContainerModule,
  HyMaterialModule,
  HyToastModule,
} from "@hyland/ui";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { HyContentListModule } from "@hyland/ui/content-list";
import { BulkActionMonitoringComponent } from "./components/bulk-action-monitoring/bulk-action-monitoring.component";

@NgModule({
  declarations: [
    BulkActionMonitoringComponent,
    BulkActionMonitoringFormComponent,
    BulkActionMonitoringResultComponent,
    BulkActionMonitoringSummaryComponent,
    BulkActionMonitoringDetailsComponent,
  ],
  imports: [
    CommonModule,
    HyMaterialModule,
    HyFormContainerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    BulkActionMonitoringRoutingModule,
    MatIconModule,
    MatCardModule,
    HyContentListModule,
    HyToastModule,
    MatTooltipModule,
  ],
})
export class BulkActionMonitoringModule {}
