import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PictureRenderGenerationComponent } from "./components/picture-render-generation.component";
import { PictureRenderGenerationRoutingModule } from "../picture-render-generation/picture-render-generation-routing.module"
@NgModule({
  declarations: [PictureRenderGenerationComponent],
  imports: [CommonModule, PictureRenderGenerationRoutingModule],
})
export class PictureRenderGenerationModule { }
