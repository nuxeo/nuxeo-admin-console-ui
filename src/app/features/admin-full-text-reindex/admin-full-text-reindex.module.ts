import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminFullTextReindexComponent } from "./components/admin-full-text-reindex.component";
import { AdminFullTextReindexRoutingModule } from "./admin-full-text-reindex-routing.module"
@NgModule({
  declarations: [AdminFullTextReindexComponent],
  imports: [CommonModule, AdminFullTextReindexRoutingModule],
})
export class AdminFullTextReindexModule { }
