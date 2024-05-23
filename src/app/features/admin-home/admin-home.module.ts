import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { AdminHomeComponent } from "./components/admin-home.component";
import { AdminProbesSummaryComponent } from "./components/admin-probes-summary/admin-probes-summary.component";
import { AdminRegistrationVersionComponent } from "./components/admin-registration-version/admin-registration-version.component";
import { AdminHomeRoutingModule } from "./admin-home-routing.module"
@NgModule({
  declarations: [
    AdminHomeComponent,
    AdminProbesSummaryComponent,
    AdminRegistrationVersionComponent,
  ],
  imports: [CommonModule, MatCardModule, MatButtonModule, AdminHomeRoutingModule],
})
export class AdminHomeModule { }
