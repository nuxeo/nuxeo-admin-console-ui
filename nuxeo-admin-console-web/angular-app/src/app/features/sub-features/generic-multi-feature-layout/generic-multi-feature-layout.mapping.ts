import { ELASTIC_SEARCH_LABELS } from "../../elastic-search-reindex/elastic-search-reindex.constants";
import { GENERIC_LABELS } from "./generic-multi-feature-layout.constants";

export const FEATURES = {
  ELASTIC_SEARCH_REINDEX: "elasticsearch-reindex"
  // Add other features here. Value MUST match route name
} as const;

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
        (requestQuery = `ecm:uuid='{queryParam}' OR ecm:ancestorId='{queryParam}'`),
          (labels = {
            pageTitle: ELASTIC_SEARCH_LABELS.FOLDER_REINDEX_TITLE,
            submitBtnLabel: ELASTIC_SEARCH_LABELS.REINDEX_BUTTON_LABEL,
          });
        break;

      case GENERIC_LABELS.NXQL:
        (requestQuery = `ecm:uuid='{queryParam}' OR ecm:ancestorId='{queryParam}'`),
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
  }
});
