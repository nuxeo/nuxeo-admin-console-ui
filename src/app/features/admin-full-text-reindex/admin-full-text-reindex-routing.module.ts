import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
import { AdminFullTextReindexComponent } from "./components/admin-full-text-reindex.component"

export const AdminFullTextReindexRoutes: Route[] = [
  {
    path: '',
    component: AdminFullTextReindexComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(AdminFullTextReindexRoutes)],
  exports: [RouterModule],
})
export class AdminFullTextReindexRoutingModule { }