import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminPictureRenderGenerationComponent } from "./components/admin-picture-render-generation.component";
import { AdminPictureRenderGenerationRoutingModule } from "./admin-picture-render-generation-routing.module"
@NgModule({
  declarations: [AdminPictureRenderGenerationComponent],
  imports: [CommonModule, AdminPictureRenderGenerationRoutingModule],
})
export class AdminPictureRenderGenerationModule { }
