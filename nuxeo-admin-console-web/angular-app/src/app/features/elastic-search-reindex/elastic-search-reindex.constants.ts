import { ElasticSearchType } from "./elastic-search-reindex.interface";

export const ELASTIC_SEARCH_REINDEX_TYPES: ElasticSearchType[] = [
  { label: "Document", path: "document", isSelected: true },
  { label: "Folder", path: "folder", isSelected: false },
  { label: "NXQL Query", path: "nxql", isSelected: false },
];

export const ELASTIC_SEARCH_REINDEX_MODAL_DIMENSIONS = {
  HEIGHT: "320px",
  WIDTH: "550px",
};

export const ELASTIC_SEARCH_REINDEX_ERROR_TYPES = {
  INVALID_DOC_ID_OR_PATH: "invalidDocIdOrPathError",
  INVALID_DOC_ID: "invalidDocIdError",
  INVALID_QUERY: "invalidQueryError",
  NO_DOCUMENT_ID_FOUND: "noDocumentIdFound",
  NO_MATCHING_QUERY: "noMatchingQuery",
  SERVER_ERROR: "serverError",
};

export const ELASTIC_SEARCH_REINDEX_ERROR_MESSAGES = {
  INVALID_DOC_ID_OR_PATH_MESSAGE:
    "Invalid document ID or path. Please enter a valid ID or path.",
  INVALID_DOC_ID_MESSAGE: "Invalid document ID. Please enter a valid ID.",
  INVALID_QUERY_MESSAGE: "Invalid query. Please enter a valid query.",
  NO_DOCUMENT_ID_FOUND_MESSAGE: "Document with ID <documentID> was not found.",
  NO_MATCHING_QUERY_MESSAGE:
    "No document matches that query. Please try again with a different query.",
  UNKNOWN_ERROR_MESSAGE: "An unknown error occured.",
};

export const ELASTIC_SEARCH_LABELS = {
  REQUIRED_DOCID_OR_PATH_ERROR:
    "Please provide a document ID or a document path",
  REQUIRED_DOCID_ERROR: "Please provide a document ID",
  REQUIRED_NXQL_QUERY_ERROR: "Please provide a valid NXQL query",
  REINDEX_WARNING:
    "This action will impact 10 documents. This action could take approximately 1d 2h 30m. Continue?",
  REINDEX_LAUNCHED: "Congratulations! Your action is launched with ID",
  COPY_MONITORING_ID:
    "Remember to take note of the ID if you want to monitor it later on.",
  REINDEX_CONFIRMATION_MODAL_TITLE: "Confirm Reindex",
  ABORT_LABEL: "Abort",
  CLOSE_LABEL: "Close",
  CONTINUE: "Continue",
  FOLDER_REINDEX_TITLE: "Reindex a document and all of its children",
  REINDEX_LAUNCHED_MODAL_TITLE: "Action launched",
  REINDEX_ERRROR_MODAL_TITLE: "An error occurred",
  REINDEXING_ERROR: "Your action was not executed due to an internal error. ",
  DOCUMENT_REINDEX_TITLE: "Reindex a single document",
  NXQL_QUERY_REINDEX_TITLE: "Reindex the results of a NXQL query",
  ERROR_DETAILS: "Details:",
  ERROR_STATUS: "Status:",
  CONTINUE_CONFIRMATION: "Would you like to continue?",
  COPY_ACTION_ID_BUTTON_LABEL: "Copy Action ID",
  IMPACT_MESSAGE:
    "The query could impact performance if it involves high volumes. Documents will not be available for search while reindexing is in progress.",
  MODAL_TYPE: {
    confirm: 1,
    launched: 2,
    error: 3,
  },
  REQUIRED_FIELD_INDICATOR: "* indicates a required field",
  REFERENCE_POINT: 2000,
  DOCUMENT_ID_OR_PATH: "Document ID or Path",
  DOCUMENT_ID: "Document ID",
  REINDEX_BUTTON_LABEL: "Reindex",
  ACTION_ID_COPIED_ALERT: "Action ID copied to clipboard!",
  SELECT_BASE_QUERY: "SELECT * FROM Document WHERE",
  UNEXPECTED_ERROR: "Unexpected error format",
  NXQL_QUERY_PLACEHOLDER:
    "SELECT * FROM Document WHERE ecm:mixinType != 'HiddenInNavigation' AND ecm:isProxy = 0 AND ecm:isVersion = 0 AND ecm:isTrashed = 0 AND dc:title = 'A document to reindex'",
  NXQL_QUERY: "NXQL Query",
  NXQL_INPUT_HINT:
    "See <a href='https://doc.nuxeo.com/nxdoc/nxql/' target='_blank'>NXQL documentation</a> for available options",
};
