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
  invalidDocIdOrPath: "Please provide a document id or a document path",
  invalidDocId: "Please provide a document id",
  invalidNXQLQuery: "Please provide a valid NXQL query",
  reindexWarning:
    "This action will impact 10 documents. This action could take approximately 1d 2h 30m. Continue?",
  reindexingLaunched: "Congratulations! Your action is launched with ID",
  copyMonitoringId:
    "Remember to take note of the ID if you want to monitor it later on.",
  reindexConfirmationModalTitle: "Confirm Reindex",
  abortLabel: "Abort",
  close: "Close",
  continue: "Continue",
  reindexSucessModalTitle: "Action launched",
  reindexErrorModalTitle: "An error happened",
  reindexingError: "Your action was not executed due to an error. Details:",
  continueConfirmation: "Would you like to continue?",
  copyActionId: "Copy action ID",
  impactMessage:
    "The query could impact performance if it involves high volumes. Documents will not be available for search while reindexing is in progress.",
  modalType: {
    confirm: 1,
    success: 2,
    error: 3,
  },
  hint: "See <a href='https://doc.nuxeo.com/nxdoc/nxql/' target='_blank'>[NXQL documentation]</a>",
  documentIdPlaceholder: "Document ID or Path",
  documentId: "Document ID",
  reIndex: "Reindex",
  nxqlQuery: "NXQL Query",
};
