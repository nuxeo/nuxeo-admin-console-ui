import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
import { ThumbnailGenerationComponent } from "./components/thumbnail-generation.component"

export const ThumbnailGenerationRoutes: Route[] = [
  {
    path: '',
    component: ThumbnailGenerationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ThumbnailGenerationRoutes)],
  exports: [RouterModule],
})
export class ThumbnailGenerationRoutingModule { }