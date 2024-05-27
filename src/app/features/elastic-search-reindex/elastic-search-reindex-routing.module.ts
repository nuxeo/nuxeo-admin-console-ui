import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
import { ElasticSearchReindexComponent } from "./components/elastic-search-reindex.component"

export const ElasticSearchReindexRoutes: Route[] = [
  {
    path: '',
    component: ElasticSearchReindexComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ElasticSearchReindexRoutes)],
  exports: [RouterModule],
})
export class ElasticSearchReindexRoutingModule { }