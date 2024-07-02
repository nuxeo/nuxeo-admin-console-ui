import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
import { ElasticSearchReindexComponent } from "./components/elastic-search-reindex.component";
import { DocumentESReindexComponent } from "./components/document-es-reindex/document-es-reindex.component";
import { FolderESReindexComponent } from "./components/folder-es-reindex/folder-es-reindex.component";
import { NXQLESReindexComponent } from "./components/nxql-es-reindex/nxql-es-reindex.component";
import { ELASTIC_SEARCH_REINDEX_TABS_TITLE } from "./elastic-search-reindex.constants";

const tabsTitle = ELASTIC_SEARCH_REINDEX_TABS_TITLE;
export const ElasticSearchReindexRoutes: Route[] = [
  {
    path: "",
    component: ElasticSearchReindexComponent,
    children: [
      {
        path: "document",
        title: tabsTitle.DOCUMENT,
        component: DocumentESReindexComponent,
      },
      {
        path: "folder",
        title: tabsTitle.FOLDER,
        component: FolderESReindexComponent,
      },
      {
        path: "nxql",
        title: tabsTitle.NXQL_QUERY,
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
