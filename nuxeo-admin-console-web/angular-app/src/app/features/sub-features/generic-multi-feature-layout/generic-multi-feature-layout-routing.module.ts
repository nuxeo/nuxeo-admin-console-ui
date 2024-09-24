import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NXQLTabComponent } from './components/nxql-tab/nxql-tab.component';
import { FolderTabComponent } from './components/folder-tab/folder-tab.component';
import { DocumentTabComponent } from './components/document-tab/document-tab.component';
import { Route } from '@angular/router';
import { GenericMultiFeatureLayoutComponent } from './generic-multi-feature-layout.component';
import { ELASTIC_SEARCH_LABELS } from '../../elastic-search-reindex/elastic-search-reindex.constants';


 const elasticSearchLabels = ELASTIC_SEARCH_LABELS;
export const GenericMultiFeatureRoutes: Route[] = [
  {
    path: "",
    component: GenericMultiFeatureLayoutComponent,
    children: [
      {
        path: "document",
       // title: elasticSearchLabels.DOCUMENT_REINDEX_TITLE,
        component: DocumentTabComponent,
      },
      {
        path: "folder",
       // title: elasticSearchLabels.FOLDER_REINDEX_TITLE,
        component: FolderTabComponent,
      },
      {
        path: "nxql",
       // title: elasticSearchLabels.NXQL_QUERY_REINDEX_TITLE,
        component: NXQLTabComponent,
      },
      { path: "**", redirectTo: "document" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(GenericMultiFeatureRoutes)],
  exports: [RouterModule],
})
export class genericMultiFeatureLayoutRoutingModule {}
