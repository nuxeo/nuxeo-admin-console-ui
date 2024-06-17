export interface ElasticSearchType {
  label: string;
  path: string;
  isSelected: boolean;
}

export interface ElasticSearchMessages {}

export const ELASTIC_SEARCH_REINDEX_TYPES: ElasticSearchType[] = [
  { label: "Document", path: "document", isSelected: true },
  { label: "Folder", path: "folder", isSelected: false },
  { label: "NXQL", path: "nxql", isSelected: false },
];

export const ELASTIC_SEARCH_MESSAGES = {
  invalidDocIdOrPath: "Please provide a document id or a document path",
  reindexingLaunched: "Congratulations! Your action is launched with ID",
  copyMonitoringId:
    "Remember to take note of the ID if you want to monitor it later on.",
  reindexConfirmationModalTitle: "Confirm Reindex",
  reindexSucessModalTitle: "Action launched",
  reindexErrorModalTitle: "An error happened",
  reindexingError: "Your action was not executed due to an error. Details:",
  modalType: {
    confirm: 1,
    success: 2,
    error: 3,
  },
};
