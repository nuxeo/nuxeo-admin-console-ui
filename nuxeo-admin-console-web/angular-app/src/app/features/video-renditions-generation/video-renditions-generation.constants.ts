export const VIDEO_RENDITIONS_LABELS = {
  FOLDER_RENDITIONS_TITLE:
    "Generate the video renditions of a document and all of its children",
  DOCUMENT_RENDITIONS_TITLE: "Generate the renditions of a single video",
  NXQL_QUERY_RENDITIONS_TITLE:
    "Generate the renditions of the videos returned by a NXQL query",
  RENDITIONS_BUTTON_LABEL: "Generate",
  CONVERSION_NAMES: "Conversion names",
  CONVERSION_NAMES_HELPER_TEXT:
    "Provide a list of conversion names to generate, or leave this field empty to regenerate them all. Separate each entry by a comma.",
  RECOMPUTE_VIDEO_INFO: "Information to recompute",
  RECOMPUTE_MISSING_ONLY: "Recompute missing information only",
  RECOMPUTE_ALL: "Recompute all video information",
  DOCUMENT_QUERY:
    "ecm:path='{query}' AND ecm:mixinType = 'Video' AND ecm:isProxy = 0 AND ecm:mixinType != 'HiddenInNavigation' AND ecm:isVersion = 0 AND ecm:isTrashed = 0",
  FOLDER_QUERY:
    "(ecm:uuid='{query}' OR ecm:ancestorId='{query}') AND ecm:mixinType = 'Video' AND ecm:isProxy = 0 AND ecm:mixinType != 'HiddenInNavigation' AND ecm:isVersion = 0 AND ecm:isTrashed = 0",
  NXQL_QUERY:
    "(ecm:uuid='{query}' OR ecm:ancestorId='{query}') AND ecm:mixinType = 'Video' AND ecm:isProxy = 0 AND ecm:mixinType != 'HiddenInNavigation' AND ecm:isVersion = 0 AND ecm:isTrashed = 0",
  NXQL_QUERY_DEFAULT_VALUE:
    "SELECT * FROM Document WHERE ecm:mixinType = 'Video' AND ecm:isProxy = 0 AND ecm:isVersion = 0 AND ecm:isTrashed = 0 AND vid:transcodedVideos/0/name IS NULL AND dc:title = 'A video without renditions'",
  VID_TRANSCODED: "vid:transcodedVideos/0/name",
  VIDEO: "Video",
  CONVERSION_NAME_KEY: "conversionNames",
  RECOMPUTE_ALL_VIDEO_INFO_KEY: "recomputeAllVideoInfo",
  CONVERSION_NAMES_LIST: ["WebM 480p", "Ogg 480p", "MP4 480p"]
};