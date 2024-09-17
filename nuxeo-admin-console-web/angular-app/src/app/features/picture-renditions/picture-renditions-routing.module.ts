import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
import { PictureRenditionsComponent } from "./components/picture-renditions.component";
import { PICTURE_RENDITIONS_LABELS } from "./picture-renditions.constants";
import { PictureDocumentRenditionsComponent } from "./components/picture-document-renditions/picture-document-renditions.component";
import { NXQLPictureRenditionComponent } from "./components/picture-nxql-renditions/picture-nxql-renditions.component";

const pictureRenditionsLabels = PICTURE_RENDITIONS_LABELS;
export const PictureRenditionsRoutes: Route[] = [
  {
    path: "",
    component: PictureRenditionsComponent,
    children: [
      {
        path: "document",
        title: pictureRenditionsLabels.DOCUMENT_RENDITIONS_TITLE,
        component:  PictureDocumentRenditionsComponent,
      },
      {
        path: "nxql",
        title: pictureRenditionsLabels.NXQL_QUERY_RENDITION_TITLE,
        component: NXQLPictureRenditionComponent,
      },
      { path: "**", redirectTo: "document" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(PictureRenditionsRoutes)],
  exports: [RouterModule],
})
export class PictureRenditionsRoutingModule {}
