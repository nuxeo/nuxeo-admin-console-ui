import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
import { VideoRenderGenerationComponent } from "./components/video-render-generation.component"

export const VideoRenderGenerationRoutes: Route[] = [
  {
    path: '',
    component: VideoRenderGenerationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(VideoRenderGenerationRoutes)],
  exports: [RouterModule],
})
export class VideoRenderGenerationRoutingModule { }