import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ThumbnailGenerationComponent } from "./components/thumbnail-generation.component";
import { ThumbnailGenerationRoutingModule } from "../thumbnail-generation/thumbnail-generation-routing.module"
@NgModule({
  declarations: [ThumbnailGenerationComponent],
  imports: [CommonModule, ThumbnailGenerationRoutingModule],
})
export class ThumbnailGenerationModule { }
