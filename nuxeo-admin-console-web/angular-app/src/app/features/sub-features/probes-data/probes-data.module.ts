import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { ProbesDataComponent } from "./components/probes-data.component";
import { MatTooltipModule } from "@angular/material/tooltip";

@NgModule({
  declarations: [
    ProbesDataComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule
  ],
  exports: [
    ProbesDataComponent,  
  ],
})

export class ProbesDataModule {}
