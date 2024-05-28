import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
import { AdminThumbnailGenerationComponent } from "./components/admin-thumbnail-generation.component"

export const AdminThumbnailGenerationRoutes: Route[] = [
  {
    path: '',
    component: AdminThumbnailGenerationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(AdminThumbnailGenerationRoutes)],
  exports: [RouterModule],
})
export class AdminThumbnailGenerationRoutingModule { }