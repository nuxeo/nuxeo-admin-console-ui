import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";

export const appRoutes: Route[] = [
  {
    path: "",
    title: "Home",
    loadChildren: () =>
      import("./features/home/home.module").then((m) => m.HomeModule),
  },
  {
    path: "system-information",
    title: "System Information",
    loadChildren: () =>
      import("./features/system-information/system-information.module").then(
        (m) => m.SystemInformationModule
      ),
  },
  {
    path: "bulk-action-monitoring",
    title: "Bulk Action Monitoring",
    loadChildren: () =>
      import(
        "./features/bulk-action-monitoring/bulk-action-monitoring.module"
      ).then((m) => m.BulkActionMonitoringModule),
  },
  {
    path: "elasticsearch-reindex",
    title: "ElasticSearch Reindex",
    loadChildren: () =>
      import(
        "./features/elastic-search-reindex/elastic-search-reindex.module"
      ).then((m) => m.ElasticSearchReindexModule),
  },
  {
    path: "fulltext-reindex",
    title: "Fulltext Reindex",
    loadChildren: () =>
      import("./features/full-text-reindex/full-text-reindex.module").then(
        (m) => m.FullTextReindexModule
      ),
  },
  {
    path: "thumbnails-generation",
    title: "Thumbnails Generation",
    loadChildren: () =>
      import(
        "./features/thumbnail-generation/thumbnail-generation.module"
      ).then((m) => m.ThumbnailGenerationModule),
  },
  {
    path: "picture-renditions-generation",
    title: "Picture Renditions Generation",
    loadChildren: () =>
      import(
        "./features/picture-render-generation/picture-render-generation.module"
      ).then((m) => m.PictureRenderGenerationModule),
  },
  {
    path: "video-renditions-generation",
    title: "Video Renditions Generation",
    loadChildren: () =>
      import(
        "./features/video-render-generation/video-render-generation.module"
      ).then((m) => m.VideoRenderGenerationModule),
  },
  {
    path: "auth",
    title: "Auth",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
  },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}