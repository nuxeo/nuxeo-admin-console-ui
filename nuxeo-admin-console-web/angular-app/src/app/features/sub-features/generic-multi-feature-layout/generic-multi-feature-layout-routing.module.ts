import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NXQLTabComponent } from "./components/nxql-tab/nxql-tab.component";
import { FolderTabComponent } from "./components/folder-tab/folder-tab.component";
import { DocumentTabComponent } from "./components/document-tab/document-tab.component";
import { Route } from "@angular/router";
import { GenericMultiFeatureLayoutComponent } from "./generic-multi-feature-layout.component";

export const GenericMultiFeatureRoutes: Route[] = [
  {
    path: "",
    component: GenericMultiFeatureLayoutComponent,
    children: [
      {
        path: "document",
        component: DocumentTabComponent,
      },
      {
        path: "folder",
        component: FolderTabComponent,
      },
      {
        path: "nxql",
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
