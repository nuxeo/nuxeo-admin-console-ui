import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
import { FullTextReindexComponent } from "./components/full-text-reindex.component"

export const FullTextReindexRoutes: Route[] = [
  {
    path: '',
    component: FullTextReindexComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(FullTextReindexRoutes)],
  exports: [RouterModule],
})
export class FullTextReindexRoutingModule { }