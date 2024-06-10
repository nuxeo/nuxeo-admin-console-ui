import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
import { ElasticSearchReindexComponent } from "./components/elastic-search-reindex.component";
import { SingleDocESReindexComponent } from "./components/single-doc-es-reindex/single-doc-es-reindex.component";
import { FolderESReindexComponent } from "./components/folder-es-reindex/folder-es-reindex.component";
import { NXQLESReindexComponent } from "./components/nxql-es-reindex/nxql-es-reindex.component";

export const ElasticSearchReindexRoutes: Route[] = [
  {
    path: "",
    component: ElasticSearchReindexComponent,
    children: [
      {
        path: "single-document",
        component: SingleDocESReindexComponent,
      },
      {
        path: "folder",
        component: FolderESReindexComponent,
      },
      {
        path: "nxql",
        component: NXQLESReindexComponent,
      },
      { path: "**", redirectTo: "single-document" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ElasticSearchReindexRoutes)],
  exports: [RouterModule],
})
export class ElasticSearchReindexRoutingModule {}
