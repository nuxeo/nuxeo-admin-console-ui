import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminSystemInformationComponent } from "./components/admin-system-information.component";
import { AdminSystemInformationRoutingModule } from "./admin-system-information-routing.modules"
@NgModule({
  declarations: [AdminSystemInformationComponent],
  imports: [CommonModule, AdminSystemInformationRoutingModule],
})
export class AdminSystemInformationModule { }
