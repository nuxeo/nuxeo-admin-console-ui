import { ELASTIC_SEARCH_LABELS } from "../../elastic-search-reindex/elastic-search-reindex.constants";
import { GENERIC_LABELS } from "./generic-multi-feature-layout.constants";
import { labelsList } from "./generic-multi-feature-layout.interface";

export const FEATURES = {
  ELASTIC_SEARCH_REINDEX: "elasticsearch-reindex",
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
    let labels: labelsList;
    let data = {};

    switch (tabType) {
      case GENERIC_LABELS.DOCUMENT:
        labels = {
          pageTitle: ELASTIC_SEARCH_LABELS.DOCUMENT_REINDEX_TITLE,
          submitBtnLabel: ELASTIC_SEARCH_LABELS.REINDEX_BUTTON_LABEL,
        };
        data = {
          queryParam: { query: `ecm:path='{query}'` },
        };
        break;

      case GENERIC_LABELS.FOLDER:
        labels = {
          pageTitle: ELASTIC_SEARCH_LABELS.FOLDER_REINDEX_TITLE,
          submitBtnLabel: ELASTIC_SEARCH_LABELS.REINDEX_BUTTON_LABEL,
        };
        data = {
          queryParam: {
            query: `ecm:uuid='{query}' OR ecm:ancestorId='{query}' ${GENERIC_LABELS.AND} ${GENERIC_LABELS.SELECT_QUERY_CONDITIONS}`,
          },
        };
        break;

      case GENERIC_LABELS.NXQL:
        labels = {
          pageTitle: ELASTIC_SEARCH_LABELS.NXQL_QUERY_REINDEX_TITLE,
          submitBtnLabel: ELASTIC_SEARCH_LABELS.REINDEX_BUTTON_LABEL,
        };
        data = {
          queryParam: {
            query: `ecm:uuid='{query}' OR ecm:ancestorId='{query}' ${GENERIC_LABELS.AND} ${GENERIC_LABELS.SELECT_QUERY_CONDITIONS}`,
          },
        };
        break;

      default:
        throw new Error(`Unsupported type: ${tabType}`);
    }

    return {
      labels,
      data,
    };
  },
});
