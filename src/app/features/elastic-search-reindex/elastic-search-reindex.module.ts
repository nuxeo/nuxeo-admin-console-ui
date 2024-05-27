import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ElasticSearchReindexComponent } from "./components/elastic-search-reindex.component";
import { ElasticSearchReindexRoutingModule } from "../elastic-search-reindex/elastic-search-reindex-routing.module"
@NgModule({
  declarations: [ElasticSearchReindexComponent],
  imports: [CommonModule, ElasticSearchReindexRoutingModule],
})
export class ElasticSearchReindexModule { }
