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
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { NetworkService } from "../../../../shared/services/network.service";
import { GenericMultiFeatureEndpointsService } from "./generic-multi-feature-endpoints.service";
import { of } from "rxjs";
import { REST_END_POINTS } from "../../../../shared/constants/rest-end-ponts.constants";
import { ActionInfo } from "../generic-multi-feature-layout.interface";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
describe("GenericMultiFeatureEndpointsService", () => {
  // Initialize TestBed for component testing
  initializeTestBed();

  let service: GenericMultiFeatureEndpointsService;
  let networkService: MockedObject<NetworkService>;

  beforeEach(() => {
    const networkServiceSpy = {
      makeHttpRequest: vi.fn().mockName("NetworkService.makeHttpRequest"),
    };

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        GenericMultiFeatureEndpointsService,
        { provide: NetworkService, useValue: networkServiceSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(GenericMultiFeatureEndpointsService);
    networkService = TestBed.inject(
      NetworkService
    ) as MockedObject<NetworkService>;
  });

  describe("performDocumentAction", () => {
    it("should make a network request with the correct endpoint and query", async () => {
      const mockResponse: ActionInfo = { commandId: "12345" };
      const requestUrl = "SELECT * FROM Document WHERE ecm:path='some/path'";
      const requestParams = {};
      const featureEndpoint = "ELASTIC_SEARCH_REINDEX";
      const restEndpoint = REST_END_POINTS[featureEndpoint];

      networkService.makeHttpRequest.mockReturnValue(of(mockResponse));

      service
        .performDocumentAction(requestUrl, requestParams, featureEndpoint, {})
        .subscribe((response) => {
          expect(response).toEqual(mockResponse);
          expect(networkService.makeHttpRequest).toHaveBeenCalledWith(
            restEndpoint,
            {
              queryParam: { query: requestUrl },
              bodyParam: requestParams,
              requestHeaders: {},
            }
          );
        });
    });
  });

  describe("performFolderAction", () => {
    it("should make a network request with the correct endpoint and query", async () => {
      const mockResponse: ActionInfo = { commandId: "67890" };
      const requestUrl =
        "SELECT * FROM Folder WHERE ecm:path='some/folder/path'";
      const requestParams = {};
      const featureEndpoint = "ELASTIC_SEARCH_REINDEX";
      const restEndpoint = REST_END_POINTS[featureEndpoint];

      networkService.makeHttpRequest.mockReturnValue(of(mockResponse));

      service
        .performFolderAction(requestUrl, requestParams, featureEndpoint, {})
        .subscribe((response) => {
          expect(response).toEqual(mockResponse);
          expect(networkService.makeHttpRequest).toHaveBeenCalledWith(
            restEndpoint,
            {
              queryParam: { query: requestUrl },
              bodyParam: requestParams,
              requestHeaders: {},
            }
          );
        });
    });
  });

  describe("performNXQLAction", () => {
    it("should make a network request with the correct endpoint and query", async () => {
      const mockResponse: ActionInfo = { commandId: "99999" };
      const requestUrl = "SELECT * FROM NXQL WHERE ecm:path='nxql/path'";
      const requestParams = {};
      const featureEndpoint = "ELASTIC_SEARCH_REINDEX";
      const restEndpoint = REST_END_POINTS[featureEndpoint];

      networkService.makeHttpRequest.mockReturnValue(of(mockResponse));

      service
        .performNXQLAction(requestUrl, requestParams, featureEndpoint, {})
        .subscribe((response) => {
          expect(response).toEqual(mockResponse);
          expect(networkService.makeHttpRequest).toHaveBeenCalledWith(
            restEndpoint,
            {
              queryParam: { query: requestUrl },
              bodyParam: requestParams,
              requestHeaders: {},
            }
          );
        });
    });
  });
});
