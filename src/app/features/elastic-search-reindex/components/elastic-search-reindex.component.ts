import { ActivatedRoute, Router } from "@angular/router";
import { ElasticSearchReindexService } from "../services/elastic-search-reindex.service";
import {
  ELASTIC_SEARCH_REINDEX_TYPES,
  ElasticSearchType,
} from "./../elastic-search-reindex.constants";
import { Component, OnInit } from "@angular/core";
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: "elastic-search-reindex",
  templateUrl: "./elastic-search-reindex.component.html",
  styleUrls: ["./elastic-search-reindex.component.scss"],
})
export class ElasticSearchReindexComponent implements OnInit {
  links: ElasticSearchType[] = ELASTIC_SEARCH_REINDEX_TYPES;
  activeLink = this.links[0];
  pageTitle = "";
  constructor(
    private elasticSearchReindexService: ElasticSearchReindexService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    // if (this.route.firstChild === null) {
    //   this.router.navigate(["document"], { relativeTo: this.route });
    // }
    this.elasticSearchReindexService.pageTitle.subscribe((title) => {
      this.pageTitle = title;
    });
  }

  onTabChange(event: any) {
    const tabs = ["document", "folder", "nxql"];
    this.router.navigate([tabs[event.index]], { relativeTo: this.route });
  }
}
