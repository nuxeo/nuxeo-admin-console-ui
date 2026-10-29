import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LocalPackagesComponent } from "./local-packages.component";

const routes: Routes = [
  {
    path: "",
    component: LocalPackagesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocalPackagesRoutingModule {}
