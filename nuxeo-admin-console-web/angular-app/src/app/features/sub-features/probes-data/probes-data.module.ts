import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { ProbesDataComponent } from "./components/probe-data.component";

import { HyContentListModule } from "@hyland/ui/content-list";
import { MatTooltipModule } from "@angular/material/tooltip";

@NgModule({
  declarations: [
    ProbesDataComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    HyContentListModule,
    MatTooltipModule,
  ],
  exports: [
    ProbesDataComponent,  
  ],
})

export class ProbesDataModule {}
