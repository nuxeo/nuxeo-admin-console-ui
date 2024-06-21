import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SystemInformationComponent } from "./components/system-information.component";
import { SystemInformationRoutingModule } from "../system-information/system-information-routing.modules"
@NgModule({
  declarations: [SystemInformationComponent],
  imports: [CommonModule, SystemInformationRoutingModule],
})
export class SystemInformationModule { }
