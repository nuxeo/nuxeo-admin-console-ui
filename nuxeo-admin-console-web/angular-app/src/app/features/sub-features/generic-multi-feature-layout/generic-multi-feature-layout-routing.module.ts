import { NgModule } from '@angular/core';
import { RouterModule, TitleStrategy } from '@angular/router';
import { NXQLTabComponent } from './components/nxql-tab/nxql-tab.component';
import { FolderTabComponent } from './components/folder-tab/folder-tab.component';
import { DocumentTabComponent } from './components/document-tab/document-tab.component';
import { Route } from '@angular/router';
import { GenericMultiFeatureLayoutComponent } from './generic-multi-feature-layout.component';
import { GenericPageTitle } from './generic-page-title';

export const GenericMultiFeatureRoutes: Route[] = [
  {
    path: "",
    component: GenericMultiFeatureLayoutComponent,
    children: [
      {
        path: "document",
        component: DocumentTabComponent,
        data: { titleStrategy: GenericPageTitle } 
      },
      {
        path: "folder",
        component: FolderTabComponent,
        data: { titleStrategy: GenericPageTitle } 
      },
      {
        path: "nxql",
        component: NXQLTabComponent,
        data: { titleStrategy: GenericPageTitle } 
      },
      { path: "**", redirectTo: "document" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(GenericMultiFeatureRoutes)],
  exports: [RouterModule],
  providers: [
    {
      provide: TitleStrategy,
      useClass: GenericPageTitle // Use your custom title strategy
    }
  ],
})
export class genericMultiFeatureLayoutRoutingModule {}
