export const PICTURE_RENDITIONS_LABELS = {
    FOLDER_RENDITIONS_TITLE: "Generate the picture renditions of a document and all of its children",
    DOCUMENT_RENDITIONS_TITLE: "Generate the renditions of a single picture",
    NXQL_QUERY_RENDITIONS_TITLE: "Generate the renditions of the pictures returned by a NXQL query",
    RENDITIONS_BUTTON_LABEL: "Generate",
    DOCUMENT_QUERY:
    "ecm:path='{query}' AND ecm:mixinType = 'Picture' AND ecm:isProxy = 0 AND ecm:mixinType != 'HiddenInNavigation' AND ecm:isVersion = 0 AND ecm:isTrashed = 0",
  FOLDER_QUERY:
    "(ecm:uuid='{query}' OR ecm:ancestorId='{query}') AND ecm:mixinType = 'Picture' AND ecm:isProxy = 0 AND ecm:mixinType != 'HiddenInNavigation' AND ecm:isVersion = 0 AND ecm:isTrashed = 0",
  NXQL_QUERY:
    "(ecm:uuid='{query}' OR ecm:ancestorId='{query}') AND ecm:mixinType = 'Picture' AND ecm:isProxy = 0 AND ecm:mixinType != 'HiddenInNavigation' AND ecm:isVersion = 0 AND ecm:isTrashed = 0",
  NXQL_QUERY_DEFAULT_VALUE:
    "SELECT * FROM Document WHERE ecm:mixinType = 'Picture' AND picture:views/*/title IS NULL AND ecm:isVersion = 0 AND ecm:isProxy = 0 AND ecm:isTrashed = 0 AND dc:title = 'A picture without renditions'",
  };
