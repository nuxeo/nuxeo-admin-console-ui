import { TestBed } from "@angular/core/testing";
import { GenericMultiFeatureUtilitiesService } from "./generic-multi-feature-utilities.service";
import { FeaturesKey } from "../generic-multi-feature-layout.mapping";
import { GENERIC_LABELS } from "../generic-multi-feature-layout.constants";
import { FormControl, FormGroup } from "@angular/forms";

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



  describe("buildRequestParams", () => {
  
    // let genericMultiFeatureUtilitiesService: GenericMultiFeatureUtilitiesService;
    it("should append query to requestParams when bodyParam exists", () => {
      const data = {
        bodyParam: {
          query: GENERIC_LABELS.QUERY,
          param1: "value1",
          param2: "value2",
        },
      };

      const inputForm = new FormGroup({
        param1: new FormControl("testValue1"),
        param2: new FormControl("testValue2"),
      });

      const requestQuery = "SELECT * FROM Document";

      const { requestUrl, requestParams } = service.buildRequestParams(
        data,
        requestQuery,
        inputForm
      );
      expect(requestUrl).toBe("");
      expect(requestParams.get(GENERIC_LABELS.QUERY)).toBe(requestQuery);
      expect(requestParams.get("param1")).toBe("testValue1");
      expect(requestParams.get("param2")).toBe("testValue2");
    });

    it("should append requestQuery to requestUrl when bodyParam does not exist", () => {
      const data = {};
      const requestQuery = "SELECT * FROM Document";
      const inputForm = new FormGroup({});

      const { requestUrl, requestParams } = service.buildRequestParams(
        data,
        requestQuery,
        inputForm
      );
      expect(requestUrl).toBe("");
      expect(requestParams.toString()).toBe("");
    });

    it("should skip appending params if input form values are not provided", () => {
      const data = {
        bodyParam: {
          param1: "value1",
          param2: "value2",
        },
      };

      const inputForm = new FormGroup({
        param1: new FormControl(""),
        param2: new FormControl(null),
      });

      const requestQuery = "SELECT * FROM Document";
      const { requestUrl, requestParams } = service.buildRequestParams(
        data,
        requestQuery,
        inputForm
      );
      expect(requestParams.get("param1")).toBeNull();
      expect(requestParams.get("param2")).toBeNull();
      expect(requestUrl).toBe("");
    });


    it("should return true for valid error object with response and json function", () => {
      const err = {
        response: {
          json: () => Promise.resolve({}),
        },
      };
      const result = service.checkIfResponseHasError(err);
      expect(result).toBeTrue();
    });
  
    it("should return false for null error", () => {
      const err = null;
      const result = service.checkIfResponseHasError(err);
      expect(result).toBeFalse();
    });
  
    it("should return false for non-object error", () => {
      const err = "string error";
      const result = service.checkIfResponseHasError(err);
      expect(result).toBeFalse();
    });
  
    it("should return false for error without response", () => {
      const err = { someProperty: "someValue" };
      const result = service.checkIfResponseHasError(err);
      expect(result).toBeFalse();
    });
  
    it("should return false for error with response but no json function", () => {
      const err = { response: {} };
      const result = service.checkIfResponseHasError(err);
      expect(result).toBeFalse();
    });
  
    it("should return false for error with response and non-function json property", () => {
      const err = { response: { json: "not a function" } };
      const result = service.checkIfResponseHasError(err);
      expect(result).toBeFalse();
    });
  });
});