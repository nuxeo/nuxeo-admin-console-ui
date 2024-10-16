import { TestBed } from "@angular/core/testing";
import { GenericMultiFeatureUtilitiesService } from "./generic-multi-feature-utilities.service";
import { FeaturesKey } from "../generic-multi-feature-layout.mapping";
import { GENERIC_LABELS } from "../generic-multi-feature-layout.constants";
import { FormControl, FormGroup } from "@angular/forms";
import { RequestParamType } from "../generic-multi-feature-layout.interface";

describe("GenericMultiFeatureUtilitiesService", () => {
  let service: GenericMultiFeatureUtilitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GenericMultiFeatureUtilitiesService],
    });
    service = TestBed.inject(GenericMultiFeatureUtilitiesService);
  });

  describe("BehaviorSubjects", () => {
    it("should initialize pageTitle with an empty string", () => {
      expect(service.pageTitle.value).toBe("");
    });

    it("should initialize spinnerStatus with false", () => {
      expect(service.spinnerStatus.value).toBe(false);
    });

    it("should set and get activeFeature", () => {
      const feature: FeaturesKey = "ELASTIC_SEARCH_REINDEX";
      service.setActiveFeature(feature);
      expect(service.getActiveFeature()).toBe(feature);
    });
  });

  describe("secondsToHumanReadable", () => {
    it("should convert seconds to human readable format", () => {
      expect(service.secondsToHumanReadable(0)).toBe("");
      expect(service.secondsToHumanReadable(59)).toBe("59 seconds");
      expect(service.secondsToHumanReadable(60)).toBe("1 minute");
      expect(service.secondsToHumanReadable(61)).toBe("1 minute 1 second");
      expect(service.secondsToHumanReadable(3600)).toBe("1 hour");
      expect(service.secondsToHumanReadable(3661)).toBe(
        "1 hour 1 minute 1 second"
      );
      expect(service.secondsToHumanReadable(86400)).toBe("1 day");
      expect(service.secondsToHumanReadable(90061)).toBe(
        "1 day 1 hour 1 minute 1 second"
      );
      expect(service.secondsToHumanReadable(2592000)).toBe("1 month");
    });
  });

  describe("removeLeadingCharacters", () => {
    it("should remove leading and trailing quotes", () => {
      expect(service.removeLeadingCharacters("'file1'")).toBe("file1");
      expect(service.removeLeadingCharacters('"file1"')).toBe("file1");
      expect(service.removeLeadingCharacters("'file1")).toBe("file1");
      expect(service.removeLeadingCharacters('"file1')).toBe("file1");
      expect(service.removeLeadingCharacters("file1")).toBe("file1");
    });
  });

  describe("decodeAndReplaceSingleQuotes", () => {
    it("should replace single quotes in the string", () => {
      const input = "/default-domain/workspaces/ws1/John's Dad's file";
      const expectedOutput =
        "/default-domain/workspaces/ws1/John%5C%27s Dad%5C%27s file";
      expect(service.decodeAndReplaceSingleQuotes(input)).toBe(expectedOutput);
    });
  });

  describe("getRequestQuery", () => {
    it("should return a properly formatted request query", () => {
      const query = "/ws2";
      const requestQuery = "{query} WHERE ecm:path=/ws2";
      const expectedQuery = `${
        GENERIC_LABELS.SELECT_BASE_QUERY
      } ${requestQuery.replaceAll("{query}", query)}`;
      expect(service.getRequestQuery(requestQuery, query)).toBe(expectedQuery);
    });
  });

  describe("insertParamInQuery", () => {
    it("should insert the parameter into the request query", () => {
      const param = "/ws1";
      const requestQuery = "SELECT * FROM DOCUMENT WHERE ecm:path='{query}'";
      const expectedQuery = "SELECT * FROM DOCUMENT WHERE ecm:path='/ws1'";
      expect(service.insertParamInQuery(requestQuery, param)).toBe(
        expectedQuery
      );
    });
  });

  describe("appendConversionsToRequest", () => {
    it("should append multiple conversion names correctly", () => {
      const result = service.appendConversionsToRequest(
        "Mp4 480p, Ogg 480p",
        "conversionName"
      );
      expect(result).toEqual("conversionName=Mp4 480p&conversionName=Ogg 480p");
    });

    it("should append a single conversion name correctly", () => {
      const result = service.appendConversionsToRequest(
        "Mp4 480p",
        "conversionName"
      );
      expect(result).toEqual("conversionName=Mp4 480p");
    });

    it("should return an empty string if no conversion names are provided", () => {
      const result = service.appendConversionsToRequest("", "conversionName");
      expect(result).toEqual("conversionName=");
    });

    describe("buildRequestParams", () => {
      it("should build request params and URL with body params", () => {
        const inputForm = new FormGroup({
          query: new FormControl("SELECT * FROM Document"),
          conversionName: new FormControl("Mp4 480p"),
          anotherParam: new FormControl("someValue"),
        });

        const data: RequestParamType = {
          bodyParam: {
            query: true,
            conversionName: true,
            anotherParam: true,
          },
        };

        const result = service.buildRequestParams(
          data,
          "SELECT * FROM Document",
          inputForm
        );

        expect(result.requestUrl).toEqual("");
        expect(result.requestParams).toEqual(
          "query=SELECT * FROM Document&conversionName=Mp4 480p&anotherParam=someValue"
        );
        expect(result.requestHeaders).toEqual({});
      });

      it("should build request params with multiple conversions", () => {
        const inputForm = new FormGroup({
          conversionNames: new FormControl("Mp4 480p, Ogg 480p"),
        });

        const data: RequestParamType = {
          bodyParam: {
            conversionNames: true,
          },
        };

        const result = service.buildRequestParams(data, "", inputForm);

        expect(result.requestParams).toEqual(
          "conversionNames=Mp4 480p&conversionNames=Ogg 480p"
        );
      });

      it("should include request headers if provided", () => {
        const inputForm = new FormGroup({
          query: new FormControl("SELECT * FROM Document"),
        });

        const data: RequestParamType = {
          bodyParam: {
            query: true,
          },
          requestHeaders: {
            "Content-type": "application/xxx-form-urlencoded",
          },
        };

        const result = service.buildRequestParams(
          data,
          "SELECT * FROM Document",
          inputForm
        );

        expect(result.requestHeaders).toEqual({
          "Content-type": "application/xxx-form-urlencoded",
        });
      });

      it("should return an empty requestUrl if no queryParam is provided", () => {
        const inputForm = new FormGroup({
          anotherParam: new FormControl("value"),
        });

        const data: RequestParamType = {
          bodyParam: {
            anotherParam: true,
          },
        };

        const result = service.buildRequestParams(data, "", inputForm);

        expect(result.requestUrl).toEqual("");
        expect(result.requestParams).toEqual("anotherParam=value");
      });
    });
  });
});
