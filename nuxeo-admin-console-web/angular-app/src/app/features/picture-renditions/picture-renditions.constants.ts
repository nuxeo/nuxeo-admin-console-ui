import { PictureSearchType } from "./picture-renditions.interface";

export const PICTURE_RENDITIONS_TYPES: PictureSearchType[] = [
  { label: "Document", path: "document", isSelected: true },
];

export const PICTURE_RENDITIONS_LABELS = {
    DOCUMENT_RENDITIONS_TITLE: "Renditions of a single document",
    REQUIRED_DOCID_OR_PATH_ERROR:
    "Please provide a document ID or a document path",
  REQUIRED_DOCID_ERROR: "Please provide a document ID",
  COPY_MONITORING_ID:
    "Remember to take note of the ID if you want to monitor it later on.",
  RENDITIONS_LAUNCHED: "Congratulations! Your action is launched with ID",
  ABORT_LABEL: "Abort",
  CONTINUE: "Continue",
  RENDITIONS_BUTTON_LABEL: "Reindex",
  ACTION_ID_COPIED_ALERT: "Action ID copied to clipboard!",
  SELECT_BASE_QUERY: "SELECT * FROM Document WHERE",
  DOCUMENT_ID_OR_PATH: "Document ID or Path",

}