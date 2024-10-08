import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
import { ROUTES_TITLE } from "./layouts/menu-bar/menu-bar.constants";

const routeTitle = ROUTES_TITLE;
export const appRoutes: Route[] = [
  {
    path: "",
    title: routeTitle.HOME,
    loadChildren: () =>
      import("./features/home/home.module").then((m) => m.HomeModule),
  },
  {
    path: "elasticsearch-reindex",
    title: routeTitle.ELASTICSEARCH_REINDEX,
    loadChildren: () =>
      import(
        "./features/elastic-search-reindex/elastic-search-reindex.module"
      ).then((m) => m.ElasticSearchReindexModule),
  },
  {
    path: "bulk-action-monitoring",
    title: routeTitle.BULKACTIONMONITORING,
    loadChildren: () =>
      import( "./features/bulk-action-monitoring/bulk-action-monitoring.module"
      ).then((m) => m.BulkActionMonitoringModule),
  },
  {
    path: "probes",
    title: routeTitle.PROBES,
    loadChildren: () =>
      import("./features/probes/probes.module").then((m) => m.ProbesModule),
  },
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
  },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}