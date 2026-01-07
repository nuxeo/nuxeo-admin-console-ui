import { initializeTestBed } from "src/test-helpers"; //This import must be the first import in the file.
import {
  beforeEach,
  describe,
  expect,
  it,
  type MockedObject,
  vi,
} from "vitest";
import { TestBed } from "@angular/core/testing";
import { HttpClient } from "@angular/common/http";
import { NetworkService } from "./network.service";
import { NuxeoJSClientService } from "./nuxeo-js-client.service";
describe("NetworkService", () => {
  // Initialize TestBed for component testing
  initializeTestBed();

  let service: NetworkService;
  let httpClientSpy: MockedObject<HttpClient>;
  let nuxeoJsClientServiceSpy: MockedObject<NuxeoJSClientService>;

  beforeEach(() => {
    const httpSpy = {
      get: vi.fn().mockName("HttpClient.get"),
      post: vi.fn().mockName("HttpClient.post"),
      put: vi.fn().mockName("HttpClient.put"),
      delete: vi.fn().mockName("HttpClient.delete"),
    };
    const nuxeoSpy = {
      getApiUrl: vi.fn().mockName("NuxeoJSClientService.getApiUrl"),
      getPlatformMajorVersion: vi
        .fn()
        .mockName("NuxeoJSClientService.getPlatformMajorVersion"),
    };

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        NetworkService,
        { provide: HttpClient, useValue: httpSpy },
        { provide: NuxeoJSClientService, useValue: nuxeoSpy },
      ],
    });

    service = TestBed.inject(NetworkService);
    httpClientSpy = httpSpy as any;
    nuxeoJsClientServiceSpy = nuxeoSpy as any;
  });

  it("should return the correct API endpoint for LTS2023", () => {
    const endpointName = "ELASTIC_SEARCH_REINDEX";
    nuxeoJsClientServiceSpy.getApiUrl.mockReturnValue(
      "http://localhost:8080/nuxeo/api/v1"
    );
    nuxeoJsClientServiceSpy.getPlatformMajorVersion.mockReturnValue(2023);
    const expectedEndpoint =
      "http://localhost:8080/nuxeo/api/v1/management/elasticsearch/reindex";
    const result = service.getAPIEndpoint(endpointName);
    expect(result).toBe(expectedEndpoint);
    expect(nuxeoJsClientServiceSpy.getApiUrl).toHaveBeenCalled();
  });

  it("should return the correct API endpoint for LTS2025", () => {
    const endpointName = "ELASTIC_SEARCH_REINDEX";
    nuxeoJsClientServiceSpy.getApiUrl.mockReturnValue(
      "http://localhost:8080/nuxeo/api/v1"
    );
    nuxeoJsClientServiceSpy.getPlatformMajorVersion.mockReturnValue(2025);
    const expectedEndpoint =
      "http://localhost:8080/nuxeo/api/v1/management/search/reindex";
    const result = service.getAPIEndpoint(endpointName);
    expect(result).toBe(expectedEndpoint);
    expect(nuxeoJsClientServiceSpy.getApiUrl).toHaveBeenCalled();
  });

  it("should call HttpClient.post with the correct URL and data for LTS2023", () => {
    const endpointName = "ELASTIC_SEARCH_REINDEX";
    const requestData = {};
    nuxeoJsClientServiceSpy.getApiUrl.mockReturnValue(
      "http://localhost:8080/nuxeo/api/v1"
    );

    nuxeoJsClientServiceSpy.getPlatformMajorVersion.mockReturnValue(2023);
    service.makeHttpRequest(endpointName, requestData);
    expect(httpClientSpy.post).toHaveBeenCalledWith(
      "http://localhost:8080/nuxeo/api/v1/management/elasticsearch/reindex",
      requestData,
      { headers: {} }
    );
  });

  it("should call HttpClient.post with the correct URL and data for LTS2025", () => {
    const endpointName = "ELASTIC_SEARCH_REINDEX";
    const requestData = {};
    nuxeoJsClientServiceSpy.getApiUrl.mockReturnValue(
      "http://localhost:8080/nuxeo/api/v1"
    );

    nuxeoJsClientServiceSpy.getPlatformMajorVersion.mockReturnValue(2025);
    service.makeHttpRequest(endpointName, requestData);
    expect(httpClientSpy.post).toHaveBeenCalledWith(
      "http://localhost:8080/nuxeo/api/v1/management/search/reindex",
      requestData,
      { headers: {} }
    );
  });

  it("should call HttpClient.get with the correct URL and params", () => {
    const endpointName = "PROBES";
    const requestData = { key: "value" };
    nuxeoJsClientServiceSpy.getApiUrl.mockReturnValue(
      "http://localhost:8080/nuxeo/api/v1"
    );
    service.makeHttpRequest(endpointName, requestData);
    expect(httpClientSpy.get).toHaveBeenCalledWith(
      "http://localhost:8080/nuxeo/api/v1/management/probes",
      {
        params: expect.anything(),
        headers: {},
      }
    );
  });
});
