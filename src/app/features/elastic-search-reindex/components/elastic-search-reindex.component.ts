import { HyKeyboardFocusService } from '@hyland/ui/keyboard-focus';
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { HyDialogService } from "@hyland/ui/dialog";
import { ElasticSearchType } from "../elastic-search-reindex.interface";
import { ELASTIC_SEARCH_REINDEX_TYPES } from "../elastic-search-reindex.constants";
import { ElasticSearchReindexService } from "../services/elastic-search-reindex.service";

@Component({
  selector: "elastic-search-reindex",
  templateUrl: "./elastic-search-reindex.component.html",
  styleUrls: ["./elastic-search-reindex.component.scss"],
})
export class ElasticSearchReindexComponent implements OnInit {
  searchTabs: ElasticSearchType[] = ELASTIC_SEARCH_REINDEX_TYPES;
  activeTab: ElasticSearchType = this.searchTabs[0];
  pageTitle = "";
  constructor(
    private dialogService: HyDialogService,
    private elasticSearchReindexService: ElasticSearchReindexService,
    private route: ActivatedRoute,
    private router: Router,
    private cdref: ChangeDetectorRef,
    private _hyKeyboardFocusService: HyKeyboardFocusService
  ) {
    const currentRoute = this.router.url;
    this.activeTab = ELASTIC_SEARCH_REINDEX_TYPES.filter(
      (type) =>
        type.path === currentRoute.slice(currentRoute.lastIndexOf("/") + 1)
    )[0];
  }

  ngOnInit() {
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
