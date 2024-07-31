import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
import { AdminVideoRenderGenerationComponent } from "./components/admin-video-render-generation.component"

export const AdminVideoRenderGenerationRoutes: Route[] = [
  {
    path: '',
    component: AdminVideoRenderGenerationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(AdminVideoRenderGenerationRoutes)],
  exports: [RouterModule],
})
export class AdminVideoRenderGenerationRoutingModule { }