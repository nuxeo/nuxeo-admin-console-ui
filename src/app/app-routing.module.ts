import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
import { HomeComponent } from "./features/home/components/home.component";

export const appRoutes: Route[] = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
