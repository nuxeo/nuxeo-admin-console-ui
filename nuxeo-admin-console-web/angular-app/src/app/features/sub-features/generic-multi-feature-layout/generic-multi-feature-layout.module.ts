import { GenericPageTitle } from './generic-page-title';
import { genericMultiFeatureLayoutRoutingModule } from './generic-multi-feature-layout-routing.module';
import { DocumentTabComponent } from './components/document-tab/document-tab.component';
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
import { RouterModule, TitleStrategy } from "@angular/router";
import {
  HyFormContainerModule,
  HyMaterialModule,
  HyMaterialTabsModule,
} from "@hyland/ui";
import { ReactiveFormsModule } from "@angular/forms";

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
    genericMultiFeatureLayoutRoutingModule
  ],
 // providers: [{ provide: TitleStrategy, useClass: GenericPageTitle }],
  exports: [GenericMultiFeatureLayoutComponent],
})
export class GenericMultiFeatureLayoutModule {}
