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
  private ngUnsubscribe = new Subject<void>(); // Subject to unsubscribe from observables

  constructor(
    private elasticSearchReindexService: ElasticSearchReindexService,
    private route: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.ngUnsubscribe) // Unsubscribe when component is destroyed
      )
      .subscribe(() => {
        this.updateActiveTab();
      });

    this.elasticSearchReindexService.pageTitle
      .pipe(
        takeUntil(this.ngUnsubscribe) // Unsubscribe when component is destroyed
      )
      .subscribe((title) => {
        this.pageTitle = title;
        this.cdRef.detectChanges(); // Trigger change detection manually
      });

    this.updateActiveTab(); // Ensure the active tab is set on component init
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  updateActiveTab() {
    const currentRoute = this.route.snapshot.firstChild?.routeConfig?.path;
    if (currentRoute) {
      this.activeTab =
        this.searchTabs.find((tab) => tab.path === currentRoute) ||
        this.searchTabs[0];
    }
  }

  activateTab(tab: ElasticSearchType) {
    this.activeTab = tab;
  }
}
