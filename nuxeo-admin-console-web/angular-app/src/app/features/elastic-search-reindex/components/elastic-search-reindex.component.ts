import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { ElasticSearchType } from "../elastic-search-reindex.interface";
import { ELASTIC_SEARCH_REINDEX_TYPES } from "../elastic-search-reindex.constants";
import { ElasticSearchReindexService } from "../services/elastic-search-reindex.service";

@Component({
  selector: "elastic-search-reindex",
  templateUrl: "./elastic-search-reindex.component.html",
  styleUrls: ["./elastic-search-reindex.component.scss"],
})
export class ElasticSearchReindexComponent implements OnInit, OnDestroy {
  searchTabs: ElasticSearchType[] = ELASTIC_SEARCH_REINDEX_TYPES;
  activeTab: ElasticSearchType = this.searchTabs[0];
  pageTitle = "";
  private activeSubscription = new Subject<void>();

  constructor(
    private elasticSearchReindexService: ElasticSearchReindexService,
    private route: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.activeSubscription)
      )
      .subscribe(() => {
        this.updateActiveTab();
      });

    this.elasticSearchReindexService.pageTitle
      .pipe(takeUntil(this.activeSubscription))
      .subscribe((title) => {
        this.pageTitle = title;
        this.cdRef.detectChanges();
      });

    this.updateActiveTab();
  }

  updateActiveTab(): void {
    const currentRoute = this.route?.snapshot?.firstChild?.routeConfig?.path;
    if (currentRoute) {
      this.activeTab =
        this.searchTabs.find((tab) => tab.path === currentRoute) ||
        this.searchTabs[0];
    }
  }

  activateTab(tab: ElasticSearchType): void {
    this.activeTab = tab;
  }

  ngOnDestroy(): void {
    this.activeSubscription.next();
    this.activeSubscription.complete();
  }
}
