import { TestBed } from "@angular/core/testing";
import { HomeService } from "./home.service";
import { NetworkService } from "../../../shared/services/network.service";
import { REST_END_POINTS } from "../../../shared/constants/rest-end-ponts.constants";
import { of, throwError } from "rxjs";
import { CapabilitiesResponse } from "../../../shared/types/capabilities.interface";

describe("HomeService", () => {
  let service: HomeService;
  let networkServiceSpy: jasmine.SpyObj<NetworkService>;
  beforeEach(() => {
    const spy = jasmine.createSpyObj("NetworkService", ["makeHttpRequest"]);
    TestBed.configureTestingModule({
      providers: [HomeService, { provide: NetworkService, useValue: spy }],
    });
    service = TestBed.inject(HomeService);
    networkServiceSpy = TestBed.inject(
      NetworkService
    ) as jasmine.SpyObj<NetworkService>;
  });
  
  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should call networkService.makeHttpRequest with REST_END_POINTS.CAPABILITIES and return its result", (done) => {
    const mockResponse: CapabilitiesResponse = {} as CapabilitiesResponse;
    networkServiceSpy.makeHttpRequest.and.returnValue(of(mockResponse));
    service.getVersionInfo().subscribe((response) => {
      expect(networkServiceSpy.makeHttpRequest).toHaveBeenCalledWith(
        REST_END_POINTS.CAPABILITIES
      );
      expect(response).toBe(mockResponse);
      done();
    });
  });

  it("should propagate error when networkService.makeHttpRequest fails", (done) => {
    const mockError = new Error("Network error");
    networkServiceSpy.makeHttpRequest.and.returnValue(
      throwError(() => mockError)
    );
    service.getVersionInfo().subscribe({
      next: () => {
        fail("Expected error, but got success response");
        done();
      },
      error: (error) => {
        expect(networkServiceSpy.makeHttpRequest).toHaveBeenCalledWith(
          REST_END_POINTS.CAPABILITIES
        );
        expect(error).toBe(mockError);
        done();
      },
    });
  });

  it("should call makeHttpRequest only once per getVersionInfo call", (done) => {
    const mockResponse: CapabilitiesResponse = {} as CapabilitiesResponse;
    networkServiceSpy.makeHttpRequest.and.returnValue(of(mockResponse));
    service.getVersionInfo().subscribe(() => {
      expect(networkServiceSpy.makeHttpRequest).toHaveBeenCalledTimes(1);
      done();
    });
  });

});
