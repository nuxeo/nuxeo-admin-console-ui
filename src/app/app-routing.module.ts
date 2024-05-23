import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";

export const appRoutes: Route[] = [
  {
    path: "",
    loadChildren: () => import("./features/admin-home/admin-home.module").then((m) => m.AdminHomeModule),
  },
  {
    path: "system-information",
    loadChildren: () => import("./features/admin-system-information/admin-system-information.module").then((m) => m.AdminSystemInformationModule),
  },
  {
    path: "bulk-action-monitoring",
    loadChildren: () => import("./features/admin-bulk-action-monitoring/admin-bulk-action-monitoring.module").then((m) => m.AdminBulkActionMonitoringModule),
  },
  {
    path: "elasticsearch-reindex",
    loadChildren: () => import("./features/admin-elastic-search-reindex/admin-elastic-search-reindex.module").then((m) => m.AdminElasticSearchReindexModule),
  },
  {
    path: "fulltext-reindex",
    loadChildren: () => import("./features/admin-full-text-reindex/admin-full-text-reindex.module").then((m) => m.AdminFullTextReindexModule),
  },
  {
    path: "thumbnails-generation",
    loadChildren: () => import("./features/admin-thumbnail-generation/admin-thumbnail-generation.module").then((m) => m.AdminThumbnailGenerationModule),
  },
  {
    path: "picture-renditions-generation",
    loadChildren: () => import("./features/admin-picture-render-generation/admin-picture-render-generation.module").then((m) => m.AdminPictureRenderGenerationModule),
  },
  {
    path: "video-renditions-generation",
    loadChildren: () => import("./features/admin-video-render-generation/admin-video-render-generation.module").then((m) => m.AdminVideoRenderGenerationModule),
  },
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
