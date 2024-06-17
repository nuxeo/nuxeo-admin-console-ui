import { ELASTIC_SEARCH_REINDEX_MODAL_EVENT } from './elastic-search-reindex.constants';
export interface ElasticSearchType {
  label: string;
  path: string;
  isSelected: boolean;
}

export interface reindexInfo {
  commandId: string | null;
}

export interface reindexModalClosedInfo {
  isClosed: boolean;
  event: any;
}
