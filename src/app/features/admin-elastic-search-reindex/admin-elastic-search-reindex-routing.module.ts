import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
import { AdminElasticSearchReindexComponent } from "./components/admin-elastic-search-reindex.component"

export const AdminElasticSearchReindexRoutes: Route[] = [
  {
    path: '',
    component: AdminElasticSearchReindexComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(AdminElasticSearchReindexRoutes)],
  exports: [RouterModule],
})
export class AdminElasticSearchReindexRoutingModule { }