import { BulkActionMonitoringRoutingModule } from './bulk-action-monitoring-routing.module';
import { MatButtonModule } from "@angular/material/button";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HyFormContainerModule, HyMaterialModule } from "@hyland/ui";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { BulkActionMonitoringComponent } from "./bulk-action-monitoring.component";

@NgModule({
  declarations: [BulkActionMonitoringComponent],
  imports: [
    CommonModule,
    HyMaterialModule,
    HyFormContainerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    BulkActionMonitoringRoutingModule
  ],
})
export class BulkActionMonitoringModule {}
