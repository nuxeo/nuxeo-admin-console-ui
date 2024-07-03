import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
import { ElasticSearchReindexComponent } from "./components/elastic-search-reindex.component";
import { DocumentESReindexComponent } from "./components/document-es-reindex/document-es-reindex.component";
import { FolderESReindexComponent } from "./components/folder-es-reindex/folder-es-reindex.component";
import { NXQLESReindexComponent } from "./components/nxql-es-reindex/nxql-es-reindex.component";
import { ELASTIC_SEARCH_LABELS } from "./elastic-search-reindex.constants";

const elasticSearchLabels = ELASTIC_SEARCH_LABELS;
export const ElasticSearchReindexRoutes: Route[] = [
  {
    path: "",
    component: ElasticSearchReindexComponent,
    children: [
      {
        path: "document",
        title: elasticSearchLabels.DOCUMENT_REINDEX_TITLE,
        component: DocumentESReindexComponent,
      },
      {
        path: "folder",
        title: elasticSearchLabels.FOLDER_REINDEX_TITLE,
        component: FolderESReindexComponent,
      },
      {
        path: "nxql",
        title: elasticSearchLabels.NXQL_QUERY_REINDEX_TITLE,
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
