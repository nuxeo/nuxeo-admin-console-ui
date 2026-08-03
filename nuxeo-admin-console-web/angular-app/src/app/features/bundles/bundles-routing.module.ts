import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BundlesComponent } from "./bundles.component";

const routes: Routes = [
  {
    path: "",
    component: BundlesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BundlesRoutingModule {}
