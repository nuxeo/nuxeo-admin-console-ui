import { ActivatedRoute, Router } from "@angular/router";
import { ElasticSearchReindexService } from "../services/elastic-search-reindex.service";
import {
  ELASTIC_SEARCH_REINDEX_TYPES,
} from "./../elastic-search-reindex.constants";
import { Component, OnInit } from "@angular/core";
import { ElasticSearchType } from "../elastic-search-reindex.interface";

@Component({
  selector: "elastic-search-reindex",
  templateUrl: "./elastic-search-reindex.component.html",
  styleUrls: ["./elastic-search-reindex.component.scss"],
})
export class ElasticSearchReindexComponent implements OnInit {
  searchTabs: ElasticSearchType[] = ELASTIC_SEARCH_REINDEX_TYPES;
  activeTab = this.searchTabs[0];
  pageTitle = "";

  constructor(
    private elasticSearchReindexService: ElasticSearchReindexService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.elasticSearchReindexService.pageTitle.subscribe((title) => {
      this.pageTitle = title;
    });
  }

  onTabChange(event: any): void {
    const tabs = ELASTIC_SEARCH_REINDEX_TYPES.map((type) => type.label);
    this.router.navigate([tabs[event.index]], { relativeTo: this.route });
  }
}
