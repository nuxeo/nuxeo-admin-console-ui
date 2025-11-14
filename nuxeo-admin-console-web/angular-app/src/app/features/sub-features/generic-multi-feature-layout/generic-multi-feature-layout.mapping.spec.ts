import {
  FEATURES,
  getFeatureKeyByValue,
  featureMap,
} from "./generic-multi-feature-layout.mapping";
import { ELASTIC_SEARCH_LABELS } from "../../elastic-search-reindex/elastic-search-reindex.constants";
import { GENERIC_LABELS } from "./generic-multi-feature-layout.constants";
import { THUMBNAIL_GENERATION_LABELS } from "../../thumbnail-generation/thumbnail-generation.constants";
import { PICTURE_RENDITIONS_LABELS } from "../../pictures/pictures-renditions.constants";
import { VIDEO_RENDITIONS_LABELS } from "../../video-renditions-generation/video-renditions-generation.constants";
import { FULLTEXT_REINDEX_LABELS } from "../../fulltext-reindex/fulltext-reindex.constants";

describe("generic-multi-feature-layout.mapping", () => {
  describe("getFeatureKeyByValue", () => {
    it("should return correct key for each feature value", () => {
      expect(getFeatureKeyByValue("elasticsearch-reindex")).toBe(
        "ELASTIC_SEARCH_REINDEX"
      );
      expect(getFeatureKeyByValue("thumbnail-generation")).toBe(
        "THUMBNAIL_GENERATION"
      );
      expect(getFeatureKeyByValue("picture-renditions")).toBe(
        "PICTURE_RENDITIONS"
      );
      expect(getFeatureKeyByValue("video-renditions-generation")).toBe(
        "VIDEO_RENDITIONS_GENERATION"
      );
      expect(getFeatureKeyByValue("fulltext-reindex")).toBe("FULLTEXT_REINDEX");
    });

    it("should return undefined for unknown value", () => {
      expect(getFeatureKeyByValue("unknown-feature")).toBeUndefined();
      expect(getFeatureKeyByValue(undefined)).toBeUndefined();
    });
  });

  describe("featureMap", () => {
    const map = featureMap();

    describe("ELASTIC_SEARCH_REINDEX", () => {
      it("should return correct labels and data for DOCUMENT", () => {
        const result = map[FEATURES.ELASTIC_SEARCH_REINDEX](
          GENERIC_LABELS.DOCUMENT
        );
        expect(result.labels.pageTitle).toBe(
          ELASTIC_SEARCH_LABELS.DOCUMENT_REINDEX_TITLE
        );
        expect(result.labels.submitBtnLabel).toBe(
          ELASTIC_SEARCH_LABELS.REINDEX_BUTTON_LABEL
        );
        expect(
          (result.data as { queryParam: { query: string } }).queryParam.query
        ).toBe(ELASTIC_SEARCH_LABELS.DOCUMENT_QUERY);
      });

      it("should return correct labels and data for FOLDER", () => {
        const result = map[FEATURES.ELASTIC_SEARCH_REINDEX](
          GENERIC_LABELS.FOLDER
        );
        expect(result.labels.pageTitle).toBe(
          ELASTIC_SEARCH_LABELS.FOLDER_REINDEX_TITLE
        );
        expect(result.labels.submitBtnLabel).toBe(
          ELASTIC_SEARCH_LABELS.REINDEX_BUTTON_LABEL
        );
        expect(
          (result.data as { queryParam: { query: string } }).queryParam.query
        ).toBe(ELASTIC_SEARCH_LABELS.FOLDER_QUERY);
      });

      it("should return correct labels and data for NXQL", () => {
        const result = map[FEATURES.ELASTIC_SEARCH_REINDEX](
          GENERIC_LABELS.NXQL
        );
        expect(result.labels.pageTitle).toBe(
          ELASTIC_SEARCH_LABELS.NXQL_QUERY_REINDEX_TITLE
        );
        expect(result.labels.submitBtnLabel).toBe(
          ELASTIC_SEARCH_LABELS.REINDEX_BUTTON_LABEL
        );
        expect(result.labels.nxqlQueryPlaceholder).toBe(
          ELASTIC_SEARCH_LABELS.NXQL_QUERY_DEFAULT_VALUE
        );
        expect(
          (result.data as { queryParam: { query: string } }).queryParam.query
        ).toBe(ELASTIC_SEARCH_LABELS.NXQL_QUERY);
      });

      it("should throw error for unsupported type", () => {
        expect(() =>
          map[FEATURES.ELASTIC_SEARCH_REINDEX]("unsupported")
        ).toThrowError();
      });
    });

    describe("THUMBNAIL_GENERATION", () => {
      it("should return correct labels and data for DOCUMENT", () => {
        const result = map[FEATURES.THUMBNAIL_GENERATION](
          GENERIC_LABELS.DOCUMENT
        );
        expect(result.labels.pageTitle).toBe(
          THUMBNAIL_GENERATION_LABELS.DOCUMENT_THUMBNAIL_GENERATION_TITLE
        );
        expect(result.labels.submitBtnLabel).toBe(
          THUMBNAIL_GENERATION_LABELS.THUMBNAIL_GENERATION_BUTTON_LABEL
        );
        expect(
          (result.data as { bodyParam: { query: string } }).bodyParam.query
        ).toBe(THUMBNAIL_GENERATION_LABELS.DOCUMENT_QUERY);
        expect(
          (result.data as { requestHeaders: { [key: string]: string } })
            .requestHeaders["Content-Type"]
        ).toBe("application/x-www-form-urlencoded");
      });

      it("should return correct labels and data for FOLDER", () => {
        const result = map[FEATURES.THUMBNAIL_GENERATION](
          GENERIC_LABELS.FOLDER
        );
        expect(result.labels.pageTitle).toBe(
          THUMBNAIL_GENERATION_LABELS.FOLDER_THUMBNAIL_GENERATION_TITLE
        );
        expect(result.labels.submitBtnLabel).toBe(
          THUMBNAIL_GENERATION_LABELS.THUMBNAIL_GENERATION_BUTTON_LABEL
        );
        expect(
          (result.data as { bodyParam: { query: string } }).bodyParam.query
        ).toBe(THUMBNAIL_GENERATION_LABELS.FOLDER_QUERY);
        expect(
          (result.data as { requestHeaders: { [key: string]: string } })
            .requestHeaders["Content-Type"]
        ).toBe("application/x-www-form-urlencoded");
      });

      it("should return correct labels and data for NXQL", () => {
        const result = map[FEATURES.THUMBNAIL_GENERATION](GENERIC_LABELS.NXQL);
        expect(result.labels.pageTitle).toBe(
          THUMBNAIL_GENERATION_LABELS.NXQL_THUMBNAIL_GENERATION_TITLE
        );
        expect(result.labels.submitBtnLabel).toBe(
          THUMBNAIL_GENERATION_LABELS.THUMBNAIL_GENERATION_BUTTON_LABEL
        );
        expect(result.labels.nxqlQueryPlaceholder).toBe(
          THUMBNAIL_GENERATION_LABELS.NXQL_QUERY_DEFAULT_VALUE
        );
        expect(
          (result.data as { bodyParam: { query: string } }).bodyParam.query
        ).toBe(THUMBNAIL_GENERATION_LABELS.NXQL_QUERY);
        expect(
          (result.data as { requestHeaders: { [key: string]: string } })
            .requestHeaders["Content-Type"]
        ).toBe("application/x-www-form-urlencoded");
      });

      it("should throw error for unsupported type", () => {
        expect(() =>
          map[FEATURES.THUMBNAIL_GENERATION]("unsupported")
        ).toThrowError();
      });
    });

    describe("PICTURE_RENDITIONS", () => {
      it("should return correct labels and data for DOCUMENT", () => {
        const result = map[FEATURES.PICTURE_RENDITIONS](
          GENERIC_LABELS.DOCUMENT
        );
        expect(result.labels.pageTitle).toBe(
          PICTURE_RENDITIONS_LABELS.DOCUMENT_RENDITIONS_TITLE
        );
        expect(result.labels.submitBtnLabel).toBe(
          PICTURE_RENDITIONS_LABELS.RENDITIONS_BUTTON_LABEL
        );
        expect(
          (result.data as { bodyParam: { query: string } }).bodyParam.query
        ).toBe(PICTURE_RENDITIONS_LABELS.DOCUMENT_QUERY);
        expect(
          (result.data as { requestHeaders: { [key: string]: string } })
            .requestHeaders["Content-Type"]
        ).toBe("application/x-www-form-urlencoded");
      });

      it("should return correct labels and data for FOLDER", () => {
        const result = map[FEATURES.PICTURE_RENDITIONS](GENERIC_LABELS.FOLDER);
        expect(result.labels.pageTitle).toBe(
          PICTURE_RENDITIONS_LABELS.FOLDER_RENDITIONS_TITLE
        );
        expect(result.labels.submitBtnLabel).toBe(
          PICTURE_RENDITIONS_LABELS.RENDITIONS_BUTTON_LABEL
        );
        expect(
          (result.data as { bodyParam: { query: string } }).bodyParam.query
        ).toBe(PICTURE_RENDITIONS_LABELS.FOLDER_QUERY);
        expect(
          (result.data as { requestHeaders: { [key: string]: string } })
            .requestHeaders["Content-Type"]
        ).toBe("application/x-www-form-urlencoded");
      });

      it("should return correct labels and data for NXQL", () => {
        const result = map[FEATURES.PICTURE_RENDITIONS](GENERIC_LABELS.NXQL);
        expect(result.labels.pageTitle).toBe(
          PICTURE_RENDITIONS_LABELS.NXQL_QUERY_RENDITIONS_TITLE
        );
        expect(result.labels.submitBtnLabel).toBe(
          PICTURE_RENDITIONS_LABELS.RENDITIONS_BUTTON_LABEL
        );
        expect(result.labels.nxqlQueryPlaceholder).toBe(
          PICTURE_RENDITIONS_LABELS.NXQL_QUERY_DEFAULT_VALUE
        );
        expect(
          (result.data as { bodyParam: { query: string } }).bodyParam.query
        ).toBe(PICTURE_RENDITIONS_LABELS.NXQL_QUERY);
        expect(
          (result.data as { requestHeaders: { [key: string]: string } })
            .requestHeaders["Content-Type"]
        ).toBe("application/x-www-form-urlencoded");
      });

      it("should throw error for unsupported type", () => {
        expect(() =>
          map[FEATURES.PICTURE_RENDITIONS]("unsupported")
        ).toThrowError();
      });
    });

    describe("VIDEO_RENDITIONS_GENERATION", () => {
      it("should return correct labels and data for DOCUMENT", () => {
        const result = map[FEATURES.VIDEO_RENDITIONS_GENERATION](
          GENERIC_LABELS.DOCUMENT
        );
        expect(result.labels.pageTitle).toBe(
          VIDEO_RENDITIONS_LABELS.DOCUMENT_RENDITIONS_TITLE
        );
        expect(result.labels.submitBtnLabel).toBe(
          VIDEO_RENDITIONS_LABELS.RENDITIONS_BUTTON_LABEL
        );
        expect(
          (result.data as { bodyParam: { query: string } }).bodyParam.query
        ).toBe(VIDEO_RENDITIONS_LABELS.DOCUMENT_QUERY);
        expect(
          (result.data as { bodyParam: { [key: string]: string } }).bodyParam[
            VIDEO_RENDITIONS_LABELS.CONVERSION_NAME_KEY
          ]
        ).toBe("{conversionNames}");
        expect(
          (result.data as { bodyParam: { [key: string]: string } }).bodyParam[
            VIDEO_RENDITIONS_LABELS.RECOMPUTE_ALL_VIDEO_INFO_KEY
          ]
        ).toBe("{recomputeAllVideoInfo}");
        expect(
          (result.data as { requestHeaders: { [key: string]: string } })
            .requestHeaders["Content-Type"]
        ).toBe("application/x-www-form-urlencoded");
      });

      it("should return correct labels and data for FOLDER", () => {
        const result = map[FEATURES.VIDEO_RENDITIONS_GENERATION](
          GENERIC_LABELS.FOLDER
        );
        expect(result.labels.pageTitle).toBe(
          VIDEO_RENDITIONS_LABELS.FOLDER_RENDITIONS_TITLE
        );
        expect(result.labels.submitBtnLabel).toBe(
          VIDEO_RENDITIONS_LABELS.RENDITIONS_BUTTON_LABEL
        );
        expect(
          (result.data as { bodyParam: { query: string } }).bodyParam.query
        ).toBe(VIDEO_RENDITIONS_LABELS.FOLDER_QUERY);
        expect(
          (result.data as { bodyParam: { [key: string]: string } }).bodyParam[
            VIDEO_RENDITIONS_LABELS.CONVERSION_NAME_KEY
          ]
        ).toBe("{conversionNames}");
        expect(
          (result.data as { bodyParam: { [key: string]: string } }).bodyParam[
            VIDEO_RENDITIONS_LABELS.RECOMPUTE_ALL_VIDEO_INFO_KEY
          ]
        ).toBe("{recomputeAllVideoInfo}");
        expect(
          (result.data as { requestHeaders: { [key: string]: string } })
            .requestHeaders["Content-Type"]
        ).toBe("application/x-www-form-urlencoded");
      });

      it("should return correct labels and data for NXQL", () => {
        const result = map[FEATURES.VIDEO_RENDITIONS_GENERATION](
          GENERIC_LABELS.NXQL
        );
        expect(result.labels.pageTitle).toBe(
          VIDEO_RENDITIONS_LABELS.NXQL_QUERY_RENDITIONS_TITLE
        );
        expect(result.labels.submitBtnLabel).toBe(
          VIDEO_RENDITIONS_LABELS.RENDITIONS_BUTTON_LABEL
        );
        expect(result.labels.nxqlQueryPlaceholder).toBe(
          VIDEO_RENDITIONS_LABELS.NXQL_QUERY_DEFAULT_VALUE
        );
        expect(
          (result.data as { bodyParam: { query: string } }).bodyParam.query
        ).toBe(VIDEO_RENDITIONS_LABELS.NXQL_QUERY);
        expect(
          (result.data as { bodyParam: { [key: string]: string } }).bodyParam[
            VIDEO_RENDITIONS_LABELS.CONVERSION_NAME_KEY
          ]
        ).toBe("{conversionNames}");
        expect(
          (result.data as { bodyParam: { [key: string]: string } }).bodyParam[
            VIDEO_RENDITIONS_LABELS.RECOMPUTE_ALL_VIDEO_INFO_KEY
          ]
        ).toBe("{recomputeAllVideoInfo}");
        expect(
          (result.data as { requestHeaders: { [key: string]: string } })
            .requestHeaders["Content-Type"]
        ).toBe("application/x-www-form-urlencoded");
      });

      it("should throw error for unsupported type", () => {
        expect(() =>
          map[FEATURES.VIDEO_RENDITIONS_GENERATION]("unsupported")
        ).toThrowError();
      });
    });

    describe("FULLTEXT_REINDEX", () => {
      it("should return correct labels and data for DOCUMENT", () => {
        const result = map[FEATURES.FULLTEXT_REINDEX](GENERIC_LABELS.DOCUMENT);
        expect(result.labels.pageTitle).toBe(
          FULLTEXT_REINDEX_LABELS.DOCUMENT_REINDEX_TITLE
        );
        expect(result.labels.submitBtnLabel).toBe(
          FULLTEXT_REINDEX_LABELS.REINDEX_BUTTON_LABEL
        );
        expect(
          (result.data as { bodyParam: { query: string } }).bodyParam.query
        ).toBe(FULLTEXT_REINDEX_LABELS.DOCUMENT_QUERY);
        expect(
          (result.data as { bodyParam: { [key: string]: string } }).bodyParam[
            FULLTEXT_REINDEX_LABELS.FORCE
          ]
        ).toBe("{force}");
        expect(
          (result.data as { requestHeaders: { [key: string]: string } })
            .requestHeaders["Content-Type"]
        ).toBe("application/x-www-form-urlencoded");
      });

      it("should return correct labels and data for FOLDER", () => {
        const result = map[FEATURES.FULLTEXT_REINDEX](GENERIC_LABELS.FOLDER);
        expect(result.labels.pageTitle).toBe(
          FULLTEXT_REINDEX_LABELS.FOLDER_REINDEX_TITLE
        );
        expect(result.labels.submitBtnLabel).toBe(
          FULLTEXT_REINDEX_LABELS.REINDEX_BUTTON_LABEL
        );
        expect(
          (result.data as { bodyParam: { query: string } }).bodyParam.query
        ).toBe(FULLTEXT_REINDEX_LABELS.FOLDER_QUERY);
        expect(
          (result.data as { bodyParam: { [key: string]: string } }).bodyParam[
            FULLTEXT_REINDEX_LABELS.FORCE
          ]
        ).toBe("{force}");
        expect(
          (result.data as { requestHeaders: { [key: string]: string } })
            .requestHeaders["Content-Type"]
        ).toBe("application/x-www-form-urlencoded");
      });

      it("should return correct labels and data for NXQL", () => {
        const result = map[FEATURES.FULLTEXT_REINDEX](GENERIC_LABELS.NXQL);
        expect(result.labels.pageTitle).toBe(
          FULLTEXT_REINDEX_LABELS.NXQL_QUERY_REINDEX_TITLE
        );
        expect(result.labels.submitBtnLabel).toBe(
          FULLTEXT_REINDEX_LABELS.REINDEX_BUTTON_LABEL
        );
        expect(result.labels.nxqlQueryPlaceholder).toBe(
          FULLTEXT_REINDEX_LABELS.NXQL_QUERY_DEFAULT_VALUE
        );
        expect(
          (result.data as { bodyParam: { query: string } }).bodyParam.query
        ).toBe(FULLTEXT_REINDEX_LABELS.NXQL_QUERY);
        expect(
          (result.data as { bodyParam: { [key: string]: string } }).bodyParam[
            FULLTEXT_REINDEX_LABELS.FORCE
          ]
        ).toBe("{force}");
        expect(
          (result.data as { requestHeaders: { [key: string]: string } })
            .requestHeaders["Content-Type"]
        ).toBe("application/x-www-form-urlencoded");
      });

      it("should throw error for unsupported type", () => {
        expect(() =>
          map[FEATURES.FULLTEXT_REINDEX]("unsupported")
        ).toThrowError();
      });
    });
  });
});
