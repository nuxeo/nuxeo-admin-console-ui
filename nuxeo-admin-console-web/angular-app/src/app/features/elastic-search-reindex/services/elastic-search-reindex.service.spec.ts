import { TestBed } from "@angular/core/testing";
import { ElasticSearchReindexService } from "./elastic-search-reindex.service";
import { NetworkService } from "../../../shared/services/network.service";
import { REST_END_POINTS } from "../../../shared/constants/rest-end-ponts.constants";

describe("ElasticSearchReindexService", () => {
  let service: ElasticSearchReindexService;
  let networkService: jasmine.SpyObj<NetworkService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj("NetworkService", ["makeHttpRequest"]);

    TestBed.configureTestingModule({
      providers: [
        ElasticSearchReindexService,
        { provide: NetworkService, useValue: spy },
      ],
    });

    service = TestBed.inject(ElasticSearchReindexService);
    networkService = TestBed.inject(
      NetworkService
    ) as jasmine.SpyObj<NetworkService>;
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("performDocumentReindex", () => {
    it("should call makeHttpRequest with the correct endpoint and parameters", () => {
      service.performDocumentReindex("some-query");
      expect(networkService.makeHttpRequest).toHaveBeenCalledWith(
        REST_END_POINTS.ELASTIC_SEARCH_REINDEX,
        { query: "some-query" }
      );
    });
  });

  describe("performFolderReindex", () => {
    it("should call makeHttpRequest with the correct endpoint and parameters", () => {
      service.performFolderReindex("some-query");
      expect(networkService.makeHttpRequest).toHaveBeenCalledWith(
        REST_END_POINTS.ELASTIC_SEARCH_REINDEX,
        { query: "some-query" }
      );
    });
  });

  describe("performNXQLReindex", () => {
    it("should call makeHttpRequest with the correct endpoint and parameters", () => {
      service.performNXQLReindex("some-query");
      expect(networkService.makeHttpRequest).toHaveBeenCalledWith(
        REST_END_POINTS.ELASTIC_SEARCH_REINDEX,
        { query: "some-query" }
      );
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
});