import { ELASTIC_SEARCH_REINDEX_TYPES, ElasticSearchType } from './../elastic-search-reindex.constants';
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "elastic-search-reindex",
  templateUrl: "./elastic-search-reindex.component.html",
  styleUrls: ["./elastic-search-reindex.component.scss"],
})
export class ElasticSearchReindexComponent implements OnInit {
  links: ElasticSearchType[] = ELASTIC_SEARCH_REINDEX_TYPES;
  activeLink = this.links[0];
  ngOnInit(): void {
    
  }
}
