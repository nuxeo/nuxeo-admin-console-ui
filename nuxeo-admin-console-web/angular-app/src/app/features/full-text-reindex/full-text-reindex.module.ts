import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FullTextReindexComponent } from "./components/full-text-reindex.component";
import { FullTextReindexRoutingModule } from "../full-text-reindex/full-text-reindex-routing.module"
@NgModule({
  declarations: [FullTextReindexComponent],
  imports: [CommonModule, FullTextReindexRoutingModule],
})
export class FullTextReindexModule { }
