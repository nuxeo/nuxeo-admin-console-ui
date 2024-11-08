export const ELASTIC_SEARCH_LABELS = {
  FOLDER_REINDEX_TITLE: "Reindex a document and all of its children",
  DOCUMENT_REINDEX_TITLE: "Reindex a single document",
  NXQL_QUERY_REINDEX_TITLE: "Reindex the results of a NXQL query",
  REINDEX_BUTTON_LABEL: "Reindex",
  DOCUMENT_QUERY: "ecm:path='{query}' AND ecm:mixinType != 'HiddenInNavigation' AND ecm:isVersion = 0 AND ecm:isTrashed = 0",
  FOLDER_QUERY:
    "(ecm:uuid='{query}' OR ecm:ancestorId='{query}') AND ecm:isProxy = 0 AND ecm:mixinType != 'HiddenInNavigation' AND ecm:isVersion = 0 AND ecm:isTrashed = 0",
  NXQL_QUERY:
    "(ecm:uuid='{query}' OR ecm:ancestorId='{query}') AND ecm:isProxy = 0 AND ecm:mixinType != 'HiddenInNavigation' AND ecm:isVersion = 0 AND ecm:isTrashed = 0",
  NXQL_QUERY_DEFAULT_VALUE:
    "SELECT * FROM Document WHERE ecm:isProxy = 0 AND ecm:mixinType != 'HiddenInNavigation' AND ecm:isVersion = 0 AND ecm:isTrashed = 0 AND dc:title = 'A document to reindex'",
};
