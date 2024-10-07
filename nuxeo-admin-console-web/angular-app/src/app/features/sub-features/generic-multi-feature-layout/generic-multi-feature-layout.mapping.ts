import { ELASTIC_SEARCH_LABELS } from "../../elastic-search-reindex/elastic-search-reindex.constants";
import { THUMBNAIL_GENERATION_LABELS } from "../../thumbnail-generation/thumbnail-generation.constants";
import { GENERIC_LABELS } from "./generic-multi-feature-layout.constants";
import { labelsList } from "./generic-multi-feature-layout.interface";

export const FEATURES = {
  ELASTIC_SEARCH_REINDEX: "elasticsearch-reindex",  
  THUMBNAIL_GENERATION: "thumbnail-generation"
  // Add other features here. Value MUST match route name
} as const;
export let labels: labelsList; 
export type FeaturesKey = keyof typeof FEATURES;

export function getFeatureKeyByValue(
  value: string | undefined
): FeaturesKey | undefined {
  const featureEntries = Object.entries(FEATURES) as [FeaturesKey, string][];
  const featureKey = featureEntries.find(
    ([, featureValue]) => featureValue === value
  );
  return featureKey ? featureKey[0] : undefined;
}

export const featureMap = () => ({
  [FEATURES.ELASTIC_SEARCH_REINDEX]: (tabType: string) => {
    let requestQuery: string;
    let labels: { pageTitle: string; submitBtnLabel: string };

    switch (tabType) {
      case GENERIC_LABELS.DOCUMENT:
        (requestQuery = `ecm:path='{queryParam}'`),
          (labels = {
            pageTitle: ELASTIC_SEARCH_LABELS.DOCUMENT_REINDEX_TITLE,
            submitBtnLabel: ELASTIC_SEARCH_LABELS.REINDEX_BUTTON_LABEL,
          });
        break;

      case GENERIC_LABELS.FOLDER:
        (requestQuery = `ecm:uuid='{queryParam}' OR ecm:ancestorId='{queryParam}' ${GENERIC_LABELS.AND} ${GENERIC_LABELS.SELECT_QUERY_CONDITIONS}`),
          (labels = {
            pageTitle: ELASTIC_SEARCH_LABELS.FOLDER_REINDEX_TITLE,
            submitBtnLabel: ELASTIC_SEARCH_LABELS.REINDEX_BUTTON_LABEL,
          });
        break;

      case GENERIC_LABELS.NXQL:
        (requestQuery = `ecm:uuid='{queryParam}' OR ecm:ancestorId='{queryParam}' ${GENERIC_LABELS.AND} ${GENERIC_LABELS.SELECT_QUERY_CONDITIONS}`),
          (labels = {
            pageTitle: ELASTIC_SEARCH_LABELS.NXQL_QUERY_REINDEX_TITLE,
            submitBtnLabel: ELASTIC_SEARCH_LABELS.REINDEX_BUTTON_LABEL,
          });
        break;

      default:
        throw new Error(`Unsupported type: ${tabType}`);
    }

    return {
      requestQuery,
      labels,
    };
  },
  [FEATURES.THUMBNAIL_GENERATION]: (tabType: string) => {
    let requestQuery: string;
    let labels: { pageTitle: string; submitBtnLabel: string };

    switch (tabType) {
      case GENERIC_LABELS.DOCUMENT:
        (requestQuery = `ecm:mixinType = "Thumbnail" AND ecm:path='{queryParam}'`),
          (labels = {
            pageTitle: THUMBNAIL_GENERATION_LABELS.DOCUMENT_THUMBNAIL_GENERATION_TITLE,
            submitBtnLabel: THUMBNAIL_GENERATION_LABELS.THUMBNAIL_GENERATION_BUTTON_LABEL,
          });
        break;

      case GENERIC_LABELS.FOLDER:
        (requestQuery = `ecm:mixinType = "Thumbnail" AND ecm:uuid='{queryParam}' OR ecm:ancestorId='{queryParam}' ${GENERIC_LABELS.AND} ${GENERIC_LABELS.SELECT_QUERY_CONDITIONS}`),
          (labels = {
            pageTitle: THUMBNAIL_GENERATION_LABELS.FOLDER_THUMBNAIL_GENERATION_TITLE,
            submitBtnLabel: THUMBNAIL_GENERATION_LABELS.THUMBNAIL_GENERATION_BUTTON_LABEL,
          });
        break;

      case GENERIC_LABELS.NXQL:
        (requestQuery = `ecm:uuid='{queryParam}' OR ecm:ancestorId='{queryParam}' ${GENERIC_LABELS.AND} ${GENERIC_LABELS.SELECT_QUERY_CONDITIONS}`),
          (labels = {
            pageTitle: THUMBNAIL_GENERATION_LABELS.NXQL_QUERY_THUMBNAIL_GENERATION_TITLE,
            submitBtnLabel: THUMBNAIL_GENERATION_LABELS.THUMBNAIL_GENERATION_BUTTON_LABEL,
          });
        break;

      default:
        throw new Error(`Unsupported type: ${tabType}`);
    }

    return {
      requestQuery,
      labels,
    };
  }
});
