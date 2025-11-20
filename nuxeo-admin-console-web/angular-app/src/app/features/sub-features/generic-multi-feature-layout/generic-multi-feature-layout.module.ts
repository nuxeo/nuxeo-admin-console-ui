import { genericMultiFeatureLayoutRoutingModule } from "./generic-multi-feature-layout-routing.module";
import { DocumentTabComponent } from "./components/document-tab/document-tab.component";
import { NXQLTabComponent } from "./components/nxql-tab/nxql-tab.component";
import { FolderTabComponent } from "./components/folder-tab/folder-tab.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTabsModule } from "@angular/material/tabs";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { GenericMultiFeatureLayoutComponent } from "./generic-multi-feature-layout.component";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatCheckboxModule } from '@angular/material/checkbox';

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
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterModule,
    genericMultiFeatureLayoutRoutingModule,
    MatDialogModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  exports: [GenericMultiFeatureLayoutComponent],
})
export class GenericMultiFeatureLayoutModule {}
