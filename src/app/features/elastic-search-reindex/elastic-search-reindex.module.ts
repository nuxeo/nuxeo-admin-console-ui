import { NXQLESReindexComponent } from "./components/nxql-es-reindex/nxql-es-reindex.component";
import { FolderESReindexComponent } from "./components/folder-es-reindex/folder-es-reindex.component";
import { SingleDocESReindexComponent } from "./components/single-doc-es-reindex/single-doc-es-reindex.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ElasticSearchReindexComponent } from "./components/elastic-search-reindex.component";
import { ElasticSearchReindexRoutingModule } from "../elastic-search-reindex/elastic-search-reindex-routing.module";
import { MatTabsModule } from "@angular/material/tabs";
import { HyMaterialModule } from "@hyland/ui";

@NgModule({
  declarations: [
    ElasticSearchReindexComponent,
    SingleDocESReindexComponent,
    FolderESReindexComponent,
    NXQLESReindexComponent,
  ],
  imports: [
    CommonModule,
    ElasticSearchReindexRoutingModule,
    MatTabsModule,
    HyMaterialModule,
  ],
})
export class ElasticSearchReindexModule {}
