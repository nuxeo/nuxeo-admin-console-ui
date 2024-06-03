import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminVideoRenderGenerationComponent } from "./components/admin-video-render-generation.component";
import { AdminVideoRenderGenerationRoutingModule } from "./admin-video-render-generation-routing.module"
@NgModule({
  declarations: [AdminVideoRenderGenerationComponent],
  imports: [CommonModule, AdminVideoRenderGenerationRoutingModule],
})
export class AdminVideoRenderGenerationModule { }
