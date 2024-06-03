import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
import { HylandSSOManagerComponent } from "./components/SSO/hylandSSOManager.component";

export const authRoutes: Route[] = [
  {
    path: '',
    component: HylandSSOManagerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
