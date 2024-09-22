import { FolderReindexDataResolver } from './folder-reindex-data.resolver';
import { DocumentReindexDataResolver } from './document-reindex-data.resolver';
import { DocumentTabComponent } from './../sub-features/generic-multi-feature-layout/components/document-tab/document-tab.component';
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
 import { Route } from "@angular/router";
// import { NXQLESReindexComponent } from "./components/nxql-es-reindex/nxql-es-reindex.component";
import { ELASTIC_SEARCH_LABELS } from "./elastic-search-reindex.constants";
import { GenericMultiFeatureLayoutComponent } from "../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.component";
import { ElasticSearchReindexService } from './services/elastic-search-reindex.service';
import { FolderTabComponent } from '../sub-features/generic-multi-feature-layout/components/folder-tab/folder-tab.component';

const elasticSearchLabels = ELASTIC_SEARCH_LABELS;
export const ElasticSearchReindexRoutes: Route[] = [
  {
    path: "",
    component: GenericMultiFeatureLayoutComponent,
    children: [
      {
        path: "document",
        title: elasticSearchLabels.DOCUMENT_REINDEX_TITLE,
        component: DocumentTabComponent,
        resolve: {
          data: DocumentReindexDataResolver
        }
      },
      {
        path: "folder",
        title: elasticSearchLabels.FOLDER_REINDEX_TITLE,
        component: FolderTabComponent,
        resolve: {
          data: FolderReindexDataResolver
        }
      }, 
      // {
      //   path: "nxql",
      //   title: elasticSearchLabels.NXQL_QUERY_REINDEX_TITLE,
      //   component: NXQLESReindexComponent,
      // },
      { path: "**", redirectTo: "document" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ElasticSearchReindexRoutes)],
  exports: [RouterModule],
})
export class ElasticSearchReindexRoutingModule {
  constructor(private elasticSearchReindexService: ElasticSearchReindexService) {

  }
}
