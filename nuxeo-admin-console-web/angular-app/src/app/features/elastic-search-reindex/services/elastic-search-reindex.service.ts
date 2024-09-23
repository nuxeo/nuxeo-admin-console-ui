import { DocumentReindexState, FolderReindexState, NXQLReindexState } from "./../store/reducers";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { REST_END_POINTS } from "../../../shared/constants/rest-end-ponts.constants";
import { NetworkService } from "../../../shared/services/network.service";
import { Store } from "@ngrx/store";
import { ELASTIC_SEARCH_LABELS } from "../elastic-search-reindex.constants";
import {
  FEATURE_NAMES,
  GENERIC_LABELS,
  TAB_TYPES,
} from "../../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.constants";
import { ActionInfo, FeatureData } from "../../sub-features/generic-multi-feature-layout/generic-multi-feature-layout.interface";

@Injectable({
  providedIn: "root",
})
export class ElasticSearchReindexService {
  pageTitle: BehaviorSubject<string> = new BehaviorSubject("");
  spinnerStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private networkService: NetworkService,
    private documentStore: Store<{ reindex: DocumentReindexState }>,
    private folderStore: Store<{ folderReindex: FolderReindexState }>,
    private nxqlStore: Store<{ nxqlReindex: NXQLReindexState }>,
  ) {}

  performDocumentReindex(requestQuery: string | null): Observable<ActionInfo> {
    return this.networkService.makeHttpRequest<ActionInfo>(
      REST_END_POINTS.ELASTIC_SEARCH_REINDEX,
      { query: requestQuery }
    );
  }

  performFolderReindex(requestQuery: string | null): Observable<ActionInfo> {
    return this.networkService.makeHttpRequest<ActionInfo>(
      REST_END_POINTS.ELASTIC_SEARCH_REINDEX,
      { query: requestQuery }
    );
  }

  performNXQLReindex(nxqlQuery: string | null): Observable<ActionInfo> {
    return this.networkService.makeHttpRequest<ActionInfo>(
      REST_END_POINTS.ELASTIC_SEARCH_REINDEX,
      { query: nxqlQuery }
    );
  }

  getDocumentTabData(): Observable<FeatureData> {
    const data = {
      featureName: FEATURE_NAMES.ELASTIC_SEARCH_REINDEX,
      tabType: TAB_TYPES.DOCUMENT,
      requestQuery: `ecm:path='{queryParam}'`,
      labels: {
        pageTitle: ELASTIC_SEARCH_LABELS.DOCUMENT_REINDEX_TITLE,
        submitBtnLabel: ELASTIC_SEARCH_LABELS.REINDEX_BUTTON_LABEL,
      },
      store: this.documentStore,
      stateType: 'DocumentReindexState',
      primaryAction: 'performDocumentReindex',
      resetStateAction: 'resetDocumentReindexState',
      taskFailureAction: 'onDocumentReindexFailure'
    };
    return of(data);
  }

  getFolderTabData(): Observable<FeatureData> {
    const data = {
      featureName: FEATURE_NAMES.ELASTIC_SEARCH_REINDEX,
      tabType: TAB_TYPES.FOLDER,
      requestQuery: `ecm:uuid='{queryParam}' OR ecm:ancestorId='{queryParam}'`,
      labels: {
        pageTitle: ELASTIC_SEARCH_LABELS.FOLDER_REINDEX_TITLE,
        submitBtnLabel: ELASTIC_SEARCH_LABELS.REINDEX_BUTTON_LABEL,
      },
      store: this.folderStore,
      stateType: 'FolderReindexState',
      primaryAction: 'performFolderReindex',
      resetStateAction: 'resetFolderReindexState',
      taskFailureAction: 'onFolderReindexFailure',
      stateSelector: 'reindex?.reindexInfo'
    };
    return of(data);
  }

  getNXQLTabData(): Observable<FeatureData> {
    const data = {
      featureName: FEATURE_NAMES.ELASTIC_SEARCH_REINDEX,
      tabType: TAB_TYPES.NXQL,
      requestQuery: `ecm:uuid='{queryParam}' OR ecm:ancestorId='{queryParam}'`,
      labels: {
        pageTitle: ELASTIC_SEARCH_LABELS.NXQL_QUERY_REINDEX_TITLE,
        submitBtnLabel: ELASTIC_SEARCH_LABELS.REINDEX_BUTTON_LABEL,
      },
      stateType: 'NXQLReindexState',
      store: this.nxqlStore,
      primaryAction: 'performNxqlReindex',
      resetStateAction: 'resetNxqlReindexState',
      taskFailureAction: 'onNxqlReindexFailure'
    };
    return of(data);
  }
}
