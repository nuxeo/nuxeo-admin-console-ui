import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";

export const appRoutes: Route[] = [
  {
    path: "",
    loadChildren: () => import("./features/home/home.module").then((m) => m.HomeModule),
  },
  {
    path: "system-information",
    loadChildren: () => import("./features/system-information/system-information.module").then((m) => m.SystemInformationModule),
  },
  {
    path: "bulk-action-monitoring",
    loadChildren: () => import("./features/bulk-action-monitoring/bulk-action-monitoring.module").then((m) => m.BulkActionMonitoringModule),
  },
  {
    path: "elasticsearch-reindex",
    loadChildren: () => import("./features/elastic-search-reindex/elastic-search-reindex.module").then((m) => m.ElasticSearchReindexModule),
  },
  {
    path: "fulltext-reindex",
    loadChildren: () => import("./features/full-text-reindex/full-text-reindex.module").then((m) => m.FullTextReindexModule),
  },
  {
    path: "thumbnails-generation",
    loadChildren: () => import("./features/thumbnail-generation/thumbnail-generation.module").then((m) => m.ThumbnailGenerationModule),
  },
  {
    path: "picture-renditions-generation",
    loadChildren: () => import("./features/picture-render-generation/picture-render-generation.module").then((m) => m.PictureRenderGenerationModule),
  },
  {
    path: "video-renditions-generation",
    loadChildren: () => import("./features/video-render-generation/video-render-generation.module").then((m) => m.VideoRenderGenerationModule),
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
