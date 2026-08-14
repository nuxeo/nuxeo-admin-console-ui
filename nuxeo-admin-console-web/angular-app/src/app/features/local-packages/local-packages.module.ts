import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";
import { LocalPackagesComponent } from "./local-packages.component";
import { LocalPackagesRoutingModule } from "./local-packages-routing.module";

@NgModule({
  declarations: [LocalPackagesComponent],
  imports: [
    CommonModule,
    LocalPackagesRoutingModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatButtonModule,
  ],
})
export class LocalPackagesModule {}
