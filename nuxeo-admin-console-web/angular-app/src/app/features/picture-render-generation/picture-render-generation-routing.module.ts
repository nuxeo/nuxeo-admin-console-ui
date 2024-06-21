import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
import { PictureRenderGenerationComponent } from "./components/picture-render-generation.component"

export const PictureRenderGenerationRoutes: Route[] = [
  {
    path: '',
    component: PictureRenderGenerationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(PictureRenderGenerationRoutes)],
  exports: [RouterModule],
})
export class PictureRenderGenerationRoutingModule { }