import { DocumentESReindexComponent } from "./components/document-es-reindex/document-es-reindex.component";
import { MatButtonModule } from "@angular/material/button";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTabsModule } from "@angular/material/tabs";
import { HyFormContainerModule, HyMaterialModule } from "@hyland/ui";
import { HyMaterialTabsModule } from "@hyland/ui/material";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { NXQLESReindexComponent } from "./components/nxql-es-reindex/nxql-es-reindex.component";
import { FolderESReindexComponent } from "./components/folder-es-reindex/folder-es-reindex.component";
import { ElasticSearchReindexComponent } from "./components/elastic-search-reindex.component";
import { ElasticSearchReindexRoutingModule } from "../elastic-search-reindex/elastic-search-reindex-routing.module";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@NgModule({
  declarations: [
    ElasticSearchReindexComponent,
    DocumentESReindexComponent,
    FolderESReindexComponent,
    NXQLESReindexComponent,
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    HyMaterialModule,
    HyFormContainerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    HyMaterialTabsModule,
    ElasticSearchReindexRoutingModule,
    MatProgressSpinnerModule,
  ],
})
export class ElasticSearchReindexModule {}
