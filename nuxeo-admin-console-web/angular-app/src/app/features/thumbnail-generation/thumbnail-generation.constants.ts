export const THUMBNAIL_GENERATION_LABELS = {
    DOCUMENT_THUMBNAIL_GENERATION_TITLE: "Generate the thumbnail of a single document",
    FOLDER_THUMBNAIL_GENERATION_TITLE: "Generate the thumbnail of a document and all of its children",
    THUMBNAIL_GENERATION_BUTTON_LABEL: "Generate",
    DOCUMENT_QUERY: "ecm:path='{query}'",
    FOLDER_QUERY:"ecm:uuid='{query}' OR ecm:ancestorId='{query}' AND ecm:isProxy = 0 AND ecm:mixinType != 'HiddenInNavigation' AND ecm:isVersion = 0 AND ecm:isTrashed = 0",
};
