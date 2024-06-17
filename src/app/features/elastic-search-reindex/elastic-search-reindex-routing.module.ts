import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
import { ElasticSearchReindexComponent } from "./components/elastic-search-reindex.component";
import { DocumentESReindexComponent } from "./components/document-es-reindex/document-es-reindex.component";
import { FolderESReindexComponent } from "./components/folder-es-reindex/folder-es-reindex.component";
import { NXQLESReindexComponent } from "./components/nxql-es-reindex/nxql-es-reindex.component";

export const ElasticSearchReindexRoutes: Route[] = [
  {
    path: "",
    component: ElasticSearchReindexComponent,
    children: [
      {
        path: "document",
        title: "Reindex a single document",
        component: DocumentESReindexComponent,
      },
      {
        path: "folder",
        title: "Reindex a document and all of its children",
        component: FolderESReindexComponent,
      },
      {
        path: "nxql",
        title: "Reindex the results of a NXQL query",
        component: NXQLESReindexComponent,
      },
      { path: "**", redirectTo: "document" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ElasticSearchReindexRoutes)],
  exports: [RouterModule],
})
export class ElasticSearchReindexRoutingModule {}
