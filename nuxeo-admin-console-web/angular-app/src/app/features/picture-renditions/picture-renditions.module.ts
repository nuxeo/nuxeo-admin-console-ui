import { PictureDocumentRenditionsComponent } from "./components/picture-document-renditions/picture-document-renditions.component";
import { MatButtonModule } from "@angular/material/button";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTabsModule } from "@angular/material/tabs";
import { HyFormContainerModule, HyMaterialModule } from "@hyland/ui";
import { HyMaterialTabsModule } from "@hyland/ui/material";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { PictureRenditionsComponent } from "./components/picture-renditions.component";
import { PictureRenditionsRoutingModule } from "./picture-renditions-routing.module";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@NgModule({
  declarations: [
    PictureRenditionsComponent,
    PictureDocumentRenditionsComponent,
   
    
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
    PictureRenditionsRoutingModule,
    MatProgressSpinnerModule,

  ],
})
export class PictureRenditionsModule {}
