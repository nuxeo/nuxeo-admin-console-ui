export const FULLTEXT_REINDEX_LABELS = {
    FOLDER_REINDEX_TITLE: "Reindex the fulltext of a document and all of its children",
    DOCUMENT_REINDEX_TITLE: "Reindex the fulltext of a single document",
    NXQL_QUERY_REINDEX_TITLE: "Reindex the fulltext of the documents returned by a NXQL query",
    REINDEX_BUTTON_LABEL: "Reindex",
    DOCUMENT_QUERY:
    "ecm:path='{query}' AND  ecm:mixinType = 'Downloadable' AND ecm:isProxy = 0 AND ecm:mixinType != 'HiddenInNavigation' AND ecm:isVersion = 0 AND ecm:isTrashed = 0",
  FOLDER_QUERY:
    "(ecm:uuid='{query}' OR ecm:ancestorId='{query}') AND ecm:mixinType = 'Downloadable' AND ecm:isProxy = 0 AND ecm:mixinType != 'HiddenInNavigation' AND ecm:isVersion = 0 AND ecm:isTrashed = 0",
  NXQL_QUERY:
    "(ecm:uuid='{query}' OR ecm:ancestorId='{query}') AND ecm:mixinType = 'Downloadable' AND ecm:isProxy = 0 AND ecm:mixinType != 'HiddenInNavigation' AND ecm:isVersion = 0 AND ecm:isTrashed = 0",
    NXQL_QUERY_DEFAULT_VALUE:
    "SELECT * FROM Document WHERE ecm:mixinType != 'HiddenInNavigation' AND ecm:isProxy = 0 AND ecm:isVersion = 0 AND ecm:isTrashed = 0 AND ecm:mixinType = 'Downloadable' AND dc:title = 'A document to reindex'",
    FORCE: "force",
    FORCE_TITLE: "Empty fulltext index of binaries for excluded documents",
    TRUE: "True",
    FALSE: "False",
    FORCE_HELPER_TEXT: "Use this option if you changed your fulltext configuration to exclude additional documents. This will remove the content of the files they hold from the fulltext index."
}
