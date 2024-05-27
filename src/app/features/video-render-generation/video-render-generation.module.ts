import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { VideoRenderGenerationComponent } from "./components/video-render-generation.component";
import { VideoRenderGenerationRoutingModule } from "../video-render-generation/video-render-generation-routing.module"
@NgModule({
  declarations: [VideoRenderGenerationComponent],
  imports: [CommonModule, VideoRenderGenerationRoutingModule],
})
export class VideoRenderGenerationModule { }
