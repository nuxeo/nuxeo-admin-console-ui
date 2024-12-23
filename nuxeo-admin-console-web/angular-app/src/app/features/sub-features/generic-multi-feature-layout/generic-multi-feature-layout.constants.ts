import { TabInfo } from "./generic-multi-feature-layout.interface";

export const TAB_INFO: TabInfo[] = [
  { label: "Document", path: "document", isSelected: true },
  { label: "Folder", path: "folder", isSelected: false },
  { label: "NXQL Query", path: "nxql", isSelected: false },
];

export const GENERIC_LABELS = {
  DOCUMENT: "document",
  FOLDER: "folder",
  NXQL: "nxql",
  CLOSE_LABEL: "Close",
  CONTINUE: "Continue",
  REQUIRED_FIELD_INDICATOR: "* indicates a required field",
  SELECT_BASE_QUERY: "SELECT * FROM Document WHERE",
  ERROR_TEXT: "error",
  REQUIRED_DOCID_OR_PATH_ERROR:
    "Please provide a document ID or a document path",
  REQUIRED_DOCID_ERROR: "Please provide a document ID",
  REQUIRED_NXQL_QUERY_ERROR: "Please provide a valid NXQL query",
  ACTION_WARNING:
    "This action will impact 10 documents. This action could take approximately 1d 2h 30m. Continue?",
  ACTION_LAUNCHED: "Congratulations! Your action is launched with ID",
  COPY_MONITORING_ID:
    "Remember to take note of the ID if you want to monitor it later on.",
  ACTION_CONFIRMATION_MODAL_TITLE: "Confirm Reindex",
  ABORT_LABEL: "Abort",
  ACTION_LAUNCHED_MODAL_TITLE: "Action launched",
  ACTION_ERRROR_MODAL_TITLE: "An error occurred",
  ACTION_ERROR: "Your action was not executed due to an internal error. ",
  CONTINUE_CONFIRMATION: "Would you like to continue?",
  COPY_ACTION_ID_BUTTON_LABEL: "Copy Action ID",
  SEE_STATUS_LABEL: "See Status",
  IMPACT_MESSAGE:
    "The query could impact performance if it involves high volumes. Documents will not be available for search while reindexing is in progress.",
  MODAL_TYPE: {
    confirm: 1,
    launched: 2,
  },
  REFERENCE_POINT: 2000,
  DOCUMENT_ID_OR_PATH: "Document ID or Path",
  DOCUMENT_ID: "Document ID",
  ACTION_ID_COPIED_ALERT: "Action ID copied to clipboard!",
  NXQL_QUERY_PLACEHOLDER_TITLE: "dc:title = 'A document to reindex'",
  AND: "AND",
  NXQL_QUERY: "NXQL Query",
  NXQL_INPUT_HINT:
    "See <a href='https://doc.nuxeo.com/nxdoc/nxql/' target='_blank'>NXQL documentation</a> for available options",
  QUERY: "query",
};

export const MODAL_DIMENSIONS = {
  HEIGHT: "320px",
  WIDTH: "550px",
};

export const ERROR_TYPES = {
  INVALID_DOC_ID_OR_PATH: "invalidDocIdOrPathError",
  INVALID_DOC_ID: "invalidDocIdError",
  INVALID_QUERY: "invalidQueryError",
  NO_DOCUMENT_ID_FOUND: "noDocumentIdFound",
  NO_MATCHING_QUERY: "noMatchingQuery",
  SERVER_ERROR: "serverError",
  INVALID_ACTION_ID: "invalidActionIdError",
  NO_ACTION_ID_FOUND: "noActionIdFound",
};

export const ERROR_MESSAGES = {
  INVALID_DOC_ID_OR_PATH_MESSAGE:
    "Invalid document ID or path. Please enter a valid ID or path.",
  INVALID_DOC_ID_MESSAGE: "Invalid document ID. Please enter a valid ID.",
  INVALID_QUERY_MESSAGE: "Invalid query. Please enter a valid query.",
  NO_DOCUMENT_ID_FOUND_MESSAGE: "No documents were found to be processed.",
  NO_MATCHING_QUERY_MESSAGE:
    "No document matches that query. Please try again with a different query.",
  UNKNOWN_ERROR_MESSAGE: "An unknown error occured.",
  INVALID_ACTION_ID_MESSAGE: "Invalid action ID. Please enter a valid ID.",
};

export const ERROR_MODAL_LABELS = {
  SERVER_ERROR: "serverError",
  ERROR_MODAL_TITLE: "An error occurred",
  ERROR_SUBHEADING: "Your action was not executed due to an internal error. ",
  ERROR_DETAILS: "Details:",
  ERROR_STATUS: "Status:",
  UNEXPECTED_ERROR: "Unexpected error format",
  UNKNOWN_ERROR_MESSAGE: "An unknown error occured.",
};

export const featuresRequiringOnlyId = ["elasticsearch-reindex"];
