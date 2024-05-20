import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminElasticSearchReindexComponent } from "./components/admin-elastic-search-reindex.component";
import { AdminElasticSearchReindexRoutingModule } from "./admin-elastic-search-reindex-routing.module"
@NgModule({
  declarations: [AdminElasticSearchReindexComponent],
  imports: [CommonModule, AdminElasticSearchReindexRoutingModule],
})
export class AdminElasticSearchReindexModule { }
