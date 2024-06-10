import { ELASTIC_SEARCH_REINDEX_TYPES, ESType } from './../elastic-search-reindex.constants';
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "elastic-search-reindex",
  templateUrl: "./elastic-search-reindex.component.html",
  styleUrls: ["./elastic-search-reindex.component.scss"],
})
export class ElasticSearchReindexComponent implements OnInit {
  links: ESType[] = ELASTIC_SEARCH_REINDEX_TYPES;
  activeLink = this.links[0];
  ngOnInit(): void {
    
  }
}
