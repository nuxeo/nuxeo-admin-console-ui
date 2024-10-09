import { VIDEO_RENDITIONS_LABELS } from "./../../video-renditions-generation/video-renditions-generation.constants";
import { ELASTIC_SEARCH_LABELS } from "../../elastic-search-reindex/elastic-search-reindex.constants";
import { GENERIC_LABELS } from "./generic-multi-feature-layout.constants";
import { labelsList } from "./generic-multi-feature-layout.interface";

export const FEATURES = {
  ELASTIC_SEARCH_REINDEX: "elasticsearch-reindex",
  VIDEO_RENDITIONS_GENERATION: "video-renditions-generation",
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
          queryParam: { query: `${ELASTIC_SEARCH_LABELS.DOCUMENT_QUERY}` },
        };
        break;

      case GENERIC_LABELS.FOLDER:
        labels = {
          pageTitle: ELASTIC_SEARCH_LABELS.FOLDER_REINDEX_TITLE,
          submitBtnLabel: ELASTIC_SEARCH_LABELS.REINDEX_BUTTON_LABEL,
        };
        data = {
          queryParam: {
            query: `${ELASTIC_SEARCH_LABELS.FOLDER_QUERY}`,
          },
        };
        break;

      case GENERIC_LABELS.NXQL:
        labels = {
          pageTitle: ELASTIC_SEARCH_LABELS.NXQL_QUERY_REINDEX_TITLE,
          submitBtnLabel: ELASTIC_SEARCH_LABELS.REINDEX_BUTTON_LABEL,
          nxqlQueryPlaceholder: ELASTIC_SEARCH_LABELS.NXQL_QUERY_DEFAULT_VALUE,
        };
        data = {
          queryParam: {
            query: `${ELASTIC_SEARCH_LABELS.NXQL_QUERY}`,
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
  [FEATURES.VIDEO_RENDITIONS_GENERATION]: (tabType: string) => {
    let labels: labelsList;
    let data = {};
    switch (tabType) {
      case GENERIC_LABELS.DOCUMENT:
        labels = {
          pageTitle: VIDEO_RENDITIONS_LABELS.DOCUMENT_RENDITIONS_TITLE,
          submitBtnLabel: VIDEO_RENDITIONS_LABELS.RENDITIONS_BUTTON_LABEL,
        };
        data = {
          bodyParam: {
            query: `${VIDEO_RENDITIONS_LABELS.DOCUMENT_QUERY}`,
            [VIDEO_RENDITIONS_LABELS.CONVERSION_NAME_KEY]: `{conversionNames}`,
            recomputeVideoInfo: `{recomputeVideoInfo}`,
          },
        };
        break;

      case GENERIC_LABELS.FOLDER:
        labels = {
          pageTitle: VIDEO_RENDITIONS_LABELS.FOLDER_RENDITIONS_TITLE,
          submitBtnLabel: VIDEO_RENDITIONS_LABELS.RENDITIONS_BUTTON_LABEL,
        };
        data = {
          bodyParam: {
            query: `${VIDEO_RENDITIONS_LABELS.FOLDER_QUERY}`,
            [VIDEO_RENDITIONS_LABELS.CONVERSION_NAME_KEY]: `{conversionNames}`,
            recomputeVideoInfo: `{recomputeVideoInfo}`,
          },
        };
        break;

      case GENERIC_LABELS.NXQL:
        labels = {
          pageTitle: VIDEO_RENDITIONS_LABELS.NXQL_QUERY_RENDITIONS_TITLE,
          submitBtnLabel: VIDEO_RENDITIONS_LABELS.RENDITIONS_BUTTON_LABEL,
          nxqlQueryPlaceholder: VIDEO_RENDITIONS_LABELS.NXQL_QUERY_DEFAULT_VALUE,
        };
        data = {
          bodyParam: {
            query: `${VIDEO_RENDITIONS_LABELS.NXQL_QUERY}`
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
