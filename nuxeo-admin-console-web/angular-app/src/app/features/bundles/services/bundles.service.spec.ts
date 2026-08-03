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
import { BundlesService } from "./bundles.service";
import { NetworkService } from "../../../shared/services/network.service";
import { REST_END_POINTS } from "../../../shared/constants/rest-end-ponts.constants";

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
});
