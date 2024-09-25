import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NetworkService } from "../../../../shared/services/network.service";
import { GenericMultiFeatureEndpointsService } from "./generic-multi-feature-endpoints.service";
import { of } from "rxjs";
import { REST_END_POINTS } from "../../../../shared/constants/rest-end-ponts.constants";
import { ActionInfo } from "../generic-multi-feature-layout.interface";

describe("GenericMultiFeatureEndpointsService", () => {
  let service: GenericMultiFeatureEndpointsService;
  let networkService: jasmine.SpyObj<NetworkService>;

  beforeEach(() => {
    const networkServiceSpy = jasmine.createSpyObj("NetworkService", ["makeHttpRequest"]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GenericMultiFeatureEndpointsService,
        { provide: NetworkService, useValue: networkServiceSpy },
      ],
    });

    service = TestBed.inject(GenericMultiFeatureEndpointsService);
    networkService = TestBed.inject(NetworkService) as jasmine.SpyObj<NetworkService>;
  });

  describe("performDocumentAction", () => {
    it("should make a network request with the correct endpoint and query", (done) => {
      const mockResponse: ActionInfo = { commandId: "12345" };
      const requestQuery = "SELECT * FROM Document WHERE ecm:path='some/path'";
      const featureEndpoint = "ELASTIC_SEARCH_REINDEX";
      const restEndpoint = REST_END_POINTS[featureEndpoint];

      networkService.makeHttpRequest.and.returnValue(of(mockResponse));

      service.performDocumentAction(requestQuery, featureEndpoint).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(networkService.makeHttpRequest).toHaveBeenCalledWith(restEndpoint, { query: requestQuery });
        done();
      });
    });
  });

  describe("performFolderAction", () => {
    it("should make a network request with the correct endpoint and query", (done) => {
      const mockResponse: ActionInfo = { commandId: "67890" };
      const requestQuery = "SELECT * FROM Folder WHERE ecm:path='some/folder/path'";
      const featureEndpoint = "ELASTIC_SEARCH_REINDEX";
      const restEndpoint = REST_END_POINTS[featureEndpoint];

      networkService.makeHttpRequest.and.returnValue(of(mockResponse));

      service.performFolderAction(requestQuery, featureEndpoint).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(networkService.makeHttpRequest).toHaveBeenCalledWith(restEndpoint, { query: requestQuery });
        done();
      });
    });
  });

  describe("performNXQLAction", () => {
    it("should make a network request with the correct endpoint and query", (done) => {
      const mockResponse: ActionInfo = { commandId: "99999" };
      const nxqlQuery = "SELECT * FROM NXQL WHERE ecm:path='nxql/path'";
      const featureEndpoint = "ELASTIC_SEARCH_REINDEX";
      const restEndpoint = REST_END_POINTS[featureEndpoint];

      networkService.makeHttpRequest.and.returnValue(of(mockResponse));

      service.performNXQLAction(nxqlQuery, featureEndpoint).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(networkService.makeHttpRequest).toHaveBeenCalledWith(restEndpoint, { query: nxqlQuery });
        done();
      });
    });
  });
});
