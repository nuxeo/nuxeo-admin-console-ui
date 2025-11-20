import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { ProbesComponent } from "./probes.component";
import { ProbesRoutingModule } from "./probes-routing-module";
import { ProbesDataModule } from "../sub-features/probes-data/probes-data.module";

@NgModule({
  declarations: [ProbesComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    ProbesRoutingModule,
    ProbesDataModule
  ],
  exports: [
    ProbesComponent,  
  ],
})

export class ProbesModule {}