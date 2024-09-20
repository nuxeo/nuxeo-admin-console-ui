import { ElasticSearchReindexService } from "./services/elastic-search-reindex.service";
// data.resolver.ts
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DocumentReindexDataResolver {
  constructor(
    private elasticSearchReindexService: ElasticSearchReindexService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.elasticSearchReindexService.getData();
  }
}
