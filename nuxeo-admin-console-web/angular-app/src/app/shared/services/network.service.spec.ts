import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { HttpClient } from "@angular/common/http";
import { NetworkService } from "./network.service";
import { NuxeoJSClientService } from "./nuxeo-js-client.service";

describe("NetworkService", () => {
  let service: NetworkService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let nuxeoJsClientServiceSpy: jasmine.SpyObj<NuxeoJSClientService>;

  beforeEach(() => {
    const httpSpy = jasmine.createSpyObj("HttpClient", [
      "get",
      "post",
      "put",
      "delete",
    ]);
    const nuxeoSpy = jasmine.createSpyObj("NuxeoJSClientService", [
      "getApiUrl",
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        NetworkService,
        { provide: HttpClient, useValue: httpSpy },
        { provide: NuxeoJSClientService, useValue: nuxeoSpy },
      ],
    });

    service = TestBed.inject(NetworkService);
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    nuxeoJsClientServiceSpy = TestBed.inject(
      NuxeoJSClientService
    ) as jasmine.SpyObj<NuxeoJSClientService>;
  });

  it("should return the correct API endpoint", () => {
    const endpointName = "ELASTIC_SEARCH_REINDEX";
    nuxeoJsClientServiceSpy.getApiUrl.and.returnValue(
      "http://localhost:8080/nuxeo/api/v1"
    );
    const expectedEndpoint =
      "http://localhost:8080/nuxeo/api/v1/management/elasticsearch/reindex";
    const result = service.getAPIEndpoint(endpointName);
    expect(result).toBe(expectedEndpoint);
    expect(nuxeoJsClientServiceSpy.getApiUrl).toHaveBeenCalled();
  });

  it("should call HttpClient.post with the correct URL and data", () => {
    const endpointName = "ELASTIC_SEARCH_REINDEX";
    const requestData = {};
    nuxeoJsClientServiceSpy.getApiUrl.and.returnValue(
      "http://localhost:8080/nuxeo/api/v1"
    );
    service.makeHttpRequest(endpointName, requestData);
    expect(httpClientSpy.post).toHaveBeenCalledWith(
      "http://localhost:8080/nuxeo/api/v1/management/elasticsearch/reindex",
      requestData,
      { headers: {} }
    );
  });

  it("should call HttpClient.get with the correct URL and params", () => {
    const endpointName = "PROBES";
    const requestData = { key: "value" };
    nuxeoJsClientServiceSpy.getApiUrl.and.returnValue(
      "http://localhost:8080/nuxeo/api/v1"
    );
    service.makeHttpRequest(endpointName, requestData);
    expect(httpClientSpy.get).toHaveBeenCalledWith(
      "http://localhost:8080/nuxeo/api/v1/management/probes",
      {
        params: jasmine.anything(),
        headers: {}
      }
    );
  });
});
