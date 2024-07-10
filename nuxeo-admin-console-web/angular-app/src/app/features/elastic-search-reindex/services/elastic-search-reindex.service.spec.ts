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
        `${service["nuxeoJsClientService"].getApiUrl()}management/elasticsearch/reindex?query=${requestQuery}`
      );
      expect(req.request.method).toBe("POST");
      req.flush(mockReindexInfoResponse);
    });
  });
});
