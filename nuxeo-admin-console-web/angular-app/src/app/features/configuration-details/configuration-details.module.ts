import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ConfigurationDetailsComponent } from "./configuration-details.component";
import { ConfigurationDetailsRoutingModule } from "./configuration-details-routing.module";
import { JsonViewerModule } from "../../shared/components/json-viewer/json-viewer.module";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [ConfigurationDetailsComponent],
  imports: [
    CommonModule,
    ConfigurationDetailsRoutingModule,
    JsonViewerModule,
    MatProgressSpinnerModule,
    MatButtonModule,
  ],
})
export class ConfigurationDetailsModule {}
