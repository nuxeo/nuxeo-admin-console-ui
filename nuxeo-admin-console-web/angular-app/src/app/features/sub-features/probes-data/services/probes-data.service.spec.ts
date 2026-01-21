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
import { ProbeDataService } from "./probes-data.service";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { NetworkService } from "../../../../shared/services/network.service";
import { REST_END_POINTS } from "../../../../shared/constants/rest-end-ponts.constants";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
describe("ProbeDataService", () => {
  // Initialize TestBed for component testing
  initializeTestBed();

  let service: ProbeDataService;
  let networkService: MockedObject<NetworkService>;

  beforeEach(() => {
    const spy = {
      makeHttpRequest: vi.fn().mockName("NetworkService.makeHttpRequest"),
    };
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ProbeDataService,
        { provide: NetworkService, useValue: spy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ProbeDataService);
    networkService = TestBed.inject(
      NetworkService
    ) as MockedObject<NetworkService>;
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should call makeHttpRequest with the correct endpoint and parameters when fetchProbesData is called", () => {
    service.getProbesInfo();
    expect(networkService.makeHttpRequest).toHaveBeenCalledWith(
      REST_END_POINTS.PROBES
    );
  });

  it("should call makeHttpRequest with the correct endpoint and parameters when launchProbe is called", () => {
    service.launchProbe("runtime");
    expect(networkService.makeHttpRequest).toHaveBeenCalledWith(
      REST_END_POINTS.LAUNCH_PROBE,
      { urlParam: { probeName: "runtime" } }
    );
  });

  it("should call makeHttpRequest with the correct endpoint and parameters when launchAllProbes is called", () => {
    service.launchAllProbes();
    expect(networkService.makeHttpRequest).toHaveBeenCalledWith(
      REST_END_POINTS.LAUNCH_ALL_PROBES
    );
  });

  describe("convertTextToTitleCase", () => {
    it("should convert single word to title case", () => {
      const result = service.formatToTitleCase("hello");
      expect(result).toBe("Hello");
    });

    it("should convert multiple words to title case", () => {
      const result = service.formatToTitleCase("hello world");
      expect(result).toBe("Hello World");
    });

    it("should handle mixed case words", () => {
      const result = service.formatToTitleCase("hElLo WoRlD");
      expect(result).toBe("Hello World");
    });

    it("should handle empty string", () => {
      const result = service.formatToTitleCase("");
      expect(result).toBe("");
    });
  });
});
