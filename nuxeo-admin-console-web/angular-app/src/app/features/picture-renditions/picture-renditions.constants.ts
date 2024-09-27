import { PictureSearchType } from "./picture-renditions.interface";

export const PICTURE_RENDITIONS_TYPES: PictureSearchType[] = [
  { label: "Document", path: "document", isSelected: true },
  { label: "NXQL Query", path: "nxql", isSelected: false },
];

export const PICTURE_RENDITIONS_LABELS = {
    DOCUMENT_RENDITIONS_TITLE: "Renditions of a single document",
    ACTION_ID_COPIED_ALERT: "Action ID copied to clipboard!",
    NXQL_QUERY_RENDITION_TITLE: "Rendition the results of a NXQL query",
    NXQL_INPUT_HINT:
    "See <a href='https://doc.nuxeo.com/nxdoc/nxql/' target='_blank'>NXQL documentation</a> for available options",
    MODAL_TYPE: {
      confirm: 1,
      launched: 2
    },
    RENDITION_LAUNCHED_MODAL_TITLE: "Action launched",
    RENDITION_LAUNCHED: "Congratulations! Your action is launched with ID",
    REQUIRED_NXQL_QUERY_ERROR: "Please provide a valid NXQL rendition query",
    COPY_MONITORING_ID:
    "Remember to take note of the ID if you want to monitor it later on.",
    REINDEX_WARNING:
    "This action will impact 10 documents. This action could take approximately 1d 2h 30m. Continue?",
    REFERENCE_POINT: 2000,
    NXQL_QUERY: "NXQL Query",
    NXQL_QUERY_PLACEHOLDER:
    "SELECT * FROM Document WHERE ecm:mixinType != 'HiddenInNavigation' AND ecm:isProxy = 0 AND ecm:isVersion = 0 AND ecm:isTrashed = 0 AND dc:title = 'A picture document to rendition'",
    RENDITION_BUTTON_LABEL: "Rendition",
    ABORT_LABEL: "Abort",
    CONTINUE: "Continue",
    CONTINUE_CONFIRMATION: "Would you like to continue?",
    COPY_ACTION_ID_BUTTON_LABEL: "Copy Action ID",
    SEE_STATUS_LABEL: "See Status",
    IMPACT_MESSAGE:
    "The query could impact performance if it involves high volumes. Documents will not be available for search while rendition is in progress.",
  }