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
import { HomeService } from "./home.service";
import { NetworkService } from "../../../shared/services/network.service";
import { REST_END_POINTS } from "../../../shared/constants/rest-end-ponts.constants";
import { of, throwError } from "rxjs";
import { CapabilitiesResponse } from "../../../shared/types/capabilities.interface";
import { InstanceInfo } from "../../../shared/types/instanceInfo.interface";
describe("HomeService", () => {
  // Initialize TestBed for component testing
  initializeTestBed();

  let service: HomeService;
  let networkServiceSpy: MockedObject<NetworkService>;
  beforeEach(() => {
    const spy = {
      makeHttpRequest: vi.fn().mockName("NetworkService.makeHttpRequest"),
    };
    TestBed.configureTestingModule({
      providers: [HomeService, { provide: NetworkService, useValue: spy }],
    });
    service = TestBed.inject(HomeService);
    networkServiceSpy = TestBed.inject(
      NetworkService
    ) as MockedObject<NetworkService>;
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should call networkService.makeHttpRequest with REST_END_POINTS.CAPABILITIES and return its result", async () => {
    const mockResponse: CapabilitiesResponse = {} as CapabilitiesResponse;
    networkServiceSpy.makeHttpRequest.mockReturnValue(of(mockResponse));
    service.getVersionInfo().subscribe((response) => {
      expect(networkServiceSpy.makeHttpRequest).toHaveBeenCalledWith(
        REST_END_POINTS.CAPABILITIES
      );
      expect(response).toBe(mockResponse);
    });
  });

  it("should propagate error when networkService.makeHttpRequest fails", async () => {
    const mockError = new Error("Network error");
    networkServiceSpy.makeHttpRequest.mockReturnValue(
      throwError(() => mockError)
    );
    service.getVersionInfo().subscribe({
      next: () => {
        throw new Error("Expected error, but got success response");
      },
      error: (error) => {
        expect(networkServiceSpy.makeHttpRequest).toHaveBeenCalledWith(
          REST_END_POINTS.CAPABILITIES
        );
        expect(error).toBe(mockError);
      },
    });
  });

  it("should call makeHttpRequest only once per getVersionInfo call", async () => {
    const mockResponse: CapabilitiesResponse = {} as CapabilitiesResponse;
    networkServiceSpy.makeHttpRequest.mockReturnValue(of(mockResponse));
    service.getVersionInfo().subscribe(() => {
      expect(networkServiceSpy.makeHttpRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe("getInstanceInfo", () => {
    it("should call networkService.makeHttpRequest with correct URL", async () => {
      const mockResponse: InstanceInfo = {} as InstanceInfo;
      networkServiceSpy.makeHttpRequest.mockReturnValue(of(mockResponse));
      service.getInstanceInfo().subscribe();
      expect(networkServiceSpy.makeHttpRequest).toHaveBeenCalledWith(
        REST_END_POINTS.INSTANCE_INFO
      );
    });

    it("should propagate instance info error when networkService.makeHttpRequest fails", async () => {
      const mockError = new Error("Network error");
      networkServiceSpy.makeHttpRequest.mockReturnValue(
        throwError(() => mockError)
      );
      service.getInstanceInfo().subscribe({
        next: () => {
          throw new Error("Expected error, but got success response");
        },
        error: (error) => {
          expect(networkServiceSpy.makeHttpRequest).toHaveBeenCalledWith(
            REST_END_POINTS.INSTANCE_INFO
          );
          expect(error).toBe(mockError);
        },
      });
    });
  });
});
