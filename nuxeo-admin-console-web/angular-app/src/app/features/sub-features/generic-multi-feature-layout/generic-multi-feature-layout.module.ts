import { NXQLTabComponent } from "./components/nxql-tab/nxql-tab.component";
import { FolderTabComponent } from "./components/folder-tab/folder-tab.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTabsModule } from "@angular/material/tabs";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { HyContentListModule } from "@hyland/ui/content-list";
import { MatTooltipModule } from "@angular/material/tooltip";
import { GenericMultiFeatureLayoutComponent } from "./generic-multi-feature-layout.component";
import { RouterModule } from "@angular/router";
import {
  HyFormContainerModule,
  HyMaterialModule,
  HyMaterialTabsModule,
} from "@hyland/ui";
import { ReactiveFormsModule } from "@angular/forms";
import { DocumentTabComponent } from "./components/document-tab/document-tab.component";

@NgModule({
  declarations: [
    GenericMultiFeatureLayoutComponent,
    DocumentTabComponent,
    FolderTabComponent,
    NXQLTabComponent,
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
    MatProgressSpinnerModule,
    RouterModule,
  ],
  exports: [GenericMultiFeatureLayoutComponent],
})
export class GenericMultiFeatureLayoutModule {}
