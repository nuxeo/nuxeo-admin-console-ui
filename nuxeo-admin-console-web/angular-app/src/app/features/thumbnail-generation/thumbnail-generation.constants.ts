export const THUMBNAIL_GENERATION_LABELS = {
    DOCUMENT_THUMBNAIL_GENERATION_TITLE: "Generate the thumbnail of a single document",
    FOLDER_THUMBNAIL_GENERATION_TITLE: "Generate the thumbnail of a document and all of its children",
    THUMBNAIL_GENERATION_BUTTON_LABEL: "Generate",
    DOCUMENT_QUERY: "ecm:path='{query}' AND ecm:mixinType != 'HiddenInNavigation' AND ecm:isVersion = 0 AND ecm:isTrashed = 0",
    FOLDER_QUERY:"(ecm:uuid='{query}' OR ecm:ancestorId='{query}') AND ecm:isProxy = 0 AND ecm:mixinType != 'HiddenInNavigation' AND ecm:isVersion = 0 AND ecm:isTrashed = 0",
    NXQL_THUMBNAIL_GENERATION_TITLE: "Generate the thumbnail of the documents returned by a NXQL query",
    NXQL_QUERY_DEFAULT_VALUE: "SELECT * FROM Document WHERE ecm:mixinType = 'Thumbnail' AND thumb:thumbnail/data IS NULL AND ecm:isVersion = 0 AND ecm:isProxy = 0 AND ecm:isTrashed = 0 AND dc:title = 'A document without thumbnail'",
    NXQL_QUERY: "(ecm:uuid='{query}' OR ecm:ancestorId='{query}') AND ecm:isProxy = 0 AND ecm:mixinType != 'HiddenInNavigation' AND ecm:isVersion = 0 AND ecm:isTrashed = 0"
};
