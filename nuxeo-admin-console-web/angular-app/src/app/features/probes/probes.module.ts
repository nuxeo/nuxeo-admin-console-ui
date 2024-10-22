import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { ProbesComponent } from "./probes.component";
import { ProbesRoutingModule } from "./probes-routing-module";
import { HyContentListModule } from "@hyland/ui/content-list";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ProbesDataModule } from "../sub-features/probes-data/probes-data.module";

@NgModule({
  declarations: [ProbesComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    ProbesRoutingModule,
    HyContentListModule,
    MatTooltipModule,
    ProbesDataModule
  ],
  exports: [
    ProbesComponent,  
  ],
})

export class ProbesModule {}