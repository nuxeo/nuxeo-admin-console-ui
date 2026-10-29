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
import { of } from "rxjs";
import { LocalPackagesService } from "./local-packages.service";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { NetworkService } from "../../../shared/services/network.service";
import { REST_END_POINTS } from "../../../shared/constants/rest-end-ponts.constants";
import { LocalPackagesResponse } from "../../../shared/types/local-packages.interface";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";

describe("LocalPackagesService", () => {
  initializeTestBed();

  let service: LocalPackagesService;
  let networkService: MockedObject<NetworkService>;

  beforeEach(() => {
    const mockResponse: LocalPackagesResponse = {
      "entity-type": "packages",
      entries: [],
    };
    const spy = {
      makeHttpRequest: vi
        .fn()
        .mockName("NetworkService.makeHttpRequest")
        .mockReturnValue(of(mockResponse)),
    };
    TestBed.configureTestingModule({
      providers: [
        LocalPackagesService,
        { provide: NetworkService, useValue: spy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(LocalPackagesService);
    networkService = TestBed.inject(
      NetworkService
    ) as MockedObject<NetworkService>;
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should call makeHttpRequest with the correct endpoint when getLocalPackages is called", () => {
    service.getLocalPackages();
    expect(networkService.makeHttpRequest).toHaveBeenCalledWith(
      REST_END_POINTS.GET_LOCAL_PACKAGES
    );
  });
});
