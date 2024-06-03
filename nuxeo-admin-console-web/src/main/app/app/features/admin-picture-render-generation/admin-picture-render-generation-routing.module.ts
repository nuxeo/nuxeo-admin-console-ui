import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
import { AdminPictureRenderGenerationComponent } from "./components/admin-picture-render-generation.component"

export const AdminPictureRenderGenerationRoutes: Route[] = [
  {
    path: '',
    component: AdminPictureRenderGenerationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(AdminPictureRenderGenerationRoutes)],
  exports: [RouterModule],
})
export class AdminPictureRenderGenerationRoutingModule { }