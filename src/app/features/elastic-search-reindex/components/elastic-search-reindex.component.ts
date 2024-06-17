import { ActivatedRoute, Router } from "@angular/router";
import { ElasticSearchReindexService } from "../services/elastic-search-reindex.service";
import {
  ELASTIC_SEARCH_REINDEX_TYPES,
  ElasticSearchType,
} from "./../elastic-search-reindex.constants";
import { Component, OnInit, ChangeDetectorRef } from "@angular/core";

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
    private router: Router,
    private cdref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.elasticSearchReindexService.pageTitle.subscribe((title) => {
      this.pageTitle = title;
      this.cdref.detectChanges();
    });
  }

  onTabChange(event: any): void {
    const tabs = ELASTIC_SEARCH_REINDEX_TYPES.map((type) => type.label);
    this.router.navigate([tabs[event.index]], { relativeTo: this.route });
  }
}
