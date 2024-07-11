import { ElasticSearchReindexService } from "./elastic-search-reindex.service";
import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { ReindexInfo } from "../elastic-search-reindex.interface";

describe("ElasticSearchReindexService", () => {
  let service: ElasticSearchReindexService;
  let httpMock: HttpTestingController;

  const mockReindexInfoResponse: ReindexInfo = {
    commandId: "20956167-dc5c-4c93-874c-67b3f598e877",
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ElasticSearchReindexService],
    });

    service = TestBed.inject(ElasticSearchReindexService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("service should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("performDocumentReindex", () => {
    it("should send an api POST call to perform document reindex", () => {
      const requestQuery =
        "SELECT * FROM DOCUMENT WHERE ecm:path='805c8feb-308c-48df-b74f-d09b4758f778'";
      service.performDocumentReindex(requestQuery).subscribe((data) => {
        expect(data).toEqual(mockReindexInfoResponse);
      });

      const req = httpMock.expectOne(
        `${service[
          "nuxeoJsClientService"
        ].getApiUrl()}management/elasticsearch/reindex?query=${requestQuery}`
      );
      expect(req.request.method).toBe("POST");
      req.flush(mockReindexInfoResponse);
    });
  });

  describe("performFolderReindex", () => {
    it("should send an api POST call to perform folder reindex", () => {
      const requestQuery =
        "SELECT * FROM DOCUMENT WHERE ecm:uuid='805c8feb-308c-48df-b74f-d09b4758f778'";
      service.performFolderReindex(requestQuery).subscribe((data) => {
        expect(data).toEqual(mockReindexInfoResponse);
      });

      const req = httpMock.expectOne(
        `${service[
          "nuxeoJsClientService"
        ].getApiUrl()}management/elasticsearch/reindex?query=${requestQuery}`
      );
      expect(req.request.method).toBe("POST");
      req.flush(mockReindexInfoResponse);
    });
  });

  describe("performNXQLReindex", () => {
    it("should send an api POST call to perform nxql query reindex", () => {
      const nxqlQuery =
        "SELECT * FROM DOCUMENT WHERE ecm:uuid='805c8feb-308c-48df-b74f-d09b4758f778'";
      service.performNXQLReindex(nxqlQuery).subscribe((data) => {
        expect(data).toEqual(mockReindexInfoResponse);
      });

      const req = httpMock.expectOne(
        `${service[
          "nuxeoJsClientService"
        ].getApiUrl()}management/elasticsearch/reindex?query=${nxqlQuery}`
      );
      expect(req.request.method).toBe("POST");
      req.flush(mockReindexInfoResponse);
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
