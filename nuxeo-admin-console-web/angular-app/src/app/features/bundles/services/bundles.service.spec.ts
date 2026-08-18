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
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { of } from "rxjs";
import { BundlesService } from "./bundles.service";
import { NetworkService } from "../../../shared/services/network.service";
import {
  REST_END_POINTS,
  REST_END_POINT_CONFIG,
} from "../../../shared/constants/rest-end-ponts.constants";
import { DistributionResponse } from "../../../shared/types/bundles.interface";

describe("BundlesService", () => {
  // Initialize TestBed for component testing
  initializeTestBed();

  let service: BundlesService;
  let networkService: MockedObject<NetworkService>;

  beforeEach(() => {
    const spy = {
      makeHttpRequest: vi.fn().mockName("NetworkService.makeHttpRequest"),
    };
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        BundlesService,
        { provide: NetworkService, useValue: spy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(BundlesService);
    networkService = TestBed.inject(
      NetworkService
    ) as MockedObject<NetworkService>;
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should call makeHttpRequest with the correct endpoint when getDistributionInfo is called", () => {
    service.getDistributionInfo();
    expect(networkService.makeHttpRequest).toHaveBeenCalledWith(
      REST_END_POINTS.GET_DISTRIBUTION_INFO
    );
  });

  it("should resolve GET_DISTRIBUTION_INFO to GET /management/distribution", () => {
    expect(REST_END_POINT_CONFIG.GET_DISTRIBUTION_INFO).toEqual({
      endpoint: "/management/distribution",
      method: "GET",
    });
  });

  it("should return the observable produced by NetworkService", () => {
    const response$ = of({ bundles: [] } as DistributionResponse);
    networkService.makeHttpRequest.mockReturnValue(response$);
    expect(service.getDistributionInfo()).toBe(response$);
  });
});
