import { ElasticSearchType } from "./elastic-search-reindex.interface";

export const ELASTIC_SEARCH_REINDEX_TYPES: ElasticSearchType[] = [
  { label: "Document", path: "document", isSelected: true },
  { label: "Folder", path: "folder", isSelected: false },
  { label: "NXQL Query", path: "nxql", isSelected: false },
];

export const ELASTIC_SEARCH_REINDEX_MODAL_EVENT = {
  isConfirmed: 0,
  isLaunched: 1,
  isFailed: 2,
};

export const ELASTIC_SEARCH_LABELS = {
  INVALID_DOCID_OR_PATH: "Please provide a document id or a document path",
  INVALID_DOC_ID: "Please provide a document id",
  INVALID_NXQL_QUERY: "Please provide a valid NXQL query",
  REINDEX_WARNING:
    "This action will impact 10 documents. This action could take approximately 1d 2h 30m. Continue?",
  REINDEXING_LAUNCHED: "Congratulations! Your action is launched with ID",
  COPY_MONITORING_ID:
    "Remember to take note of the ID if you want to monitor it later on.",
  REINDEX_CONFIRMATION_MODAL_TITLE: "Confirm Reindex",
  ABORT_LABEL: "Abort",
  CLOSE: "Close",
  CONTINUE: "Continue",
  REINDEX_SUCESS_MODAL_TITLE: "Action launched",
  REINDEX_ERRROR_MODAL_TITLE: "An error occurred",
  REINDEXING_ERROR: "Your action was not executed due to an error. ",
  SINGLE_DOC_REINDEX_TITLE: "Reindex a single document",
  FOLDER_DOC_REINDEX_TITLE: "Reindex a document and all of its children",
  NXQL_QUERY_REINDEX_TITLE: "Reindex the results of a NXQL query",
  ERROR_DETAILS: "Details:",
  CONTINUE_CONFIRMATION: "Would you like to continue?",
  COPY_ACTION_ID: "Copy action ID",
  IMPACT_MESSAGE:
    "The query could impact performance if it involves high volumes. Documents will not be available for search while reindexing is in progress.",
  modalType: {
    confirm: 1,
    success: 2,
    error: 3,
  },
  DOCUMENT_ID_PLACEHOLDER: "Document ID or Path",
  DOCUMENT_ID: "Document ID",
  REINDEX: "Reindex",
  NXQL_QUERY: "NXQL Query",
  HINT: "See <a href='https://doc.nuxeo.com/nxdoc/nxql/' target='_blank'>NXQL documentation</a> for available options",
};
