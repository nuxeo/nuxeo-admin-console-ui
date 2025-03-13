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
    FAILED_TO_STOP_FETCH: "Failed to stop fetching records"
  };