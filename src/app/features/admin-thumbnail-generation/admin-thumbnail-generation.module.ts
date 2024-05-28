import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminThumbnailGenerationComponent } from "./components/admin-thumbnail-generation.component";
import { AdminThumbnailGenerationRoutingModule } from "./admin-thumbnail-generation-routing.module"
@NgModule({
  declarations: [AdminThumbnailGenerationComponent],
  imports: [CommonModule, AdminThumbnailGenerationRoutingModule],
})
export class AdminThumbnailGenerationModule { }
