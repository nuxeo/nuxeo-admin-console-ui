import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { HomeService } from "./home.service";
import { CapabilitiesResponse } from "../../../shared/types/capabilities.interface";
import { ProbesResponse } from "./../../../shared/types/probes.interface";

describe("HomeService", () => {
  let service: HomeService;
  let httpMock: HttpTestingController;

  const mockCapabilitiesResponse: CapabilitiesResponse = {
    server: {
      distributionVersion: "Nuxeo Platform 2021.45.8",
    },
    cluster: {
      enabled: true,
    },
  };

  const mockProbesResponse: ProbesResponse = {
    entries: [
      {
        name: "testProbe",
        status: {
          neverExecuted: false,
          success: true,
          infos: {
            info: "Test info",
          },
        },
        history: {
          lastRun: "2024-07-17T10:00:00Z",
          lastSuccess: "2024-07-17T10:00:00Z",
          lastFail: "",
        },
      },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HomeService],
    });

    service = TestBed.inject(HomeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("getVersionInfo", () => {
    it("should fetch version info", () => {
      service.getVersionInfo().subscribe((data) => {
        expect(data).toEqual(mockCapabilitiesResponse);
      });

      const req = httpMock.expectOne(
        `${service["nuxeoJsClientService"].getApiUrl()}/capabilities`
      );
      expect(req.request.method).toBe("GET");
      req.flush(mockCapabilitiesResponse);
    });

    it("should handle http error", () => {
      const errorResponse = {
        status: 500,
        statusText: "Server Error",
      };

      service.getVersionInfo().subscribe(
        () => fail("expected an error, not version info"),
        (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe("Server Error");
        }
      );

      const req = httpMock.expectOne(
        `${service["nuxeoJsClientService"].getApiUrl()}/capabilities`
      );

      expect(req.request.method).toBe("GET");
      req.flush(null, errorResponse);
    });

  });

  describe("getProbesInfo", () => {
    it("should fetch probes info", () => {
      service.getProbesInfo().subscribe((data) => {
        expect(data).toEqual(mockProbesResponse);
      });

      const req = httpMock.expectOne(
        `${service["nuxeoJsClientService"].getApiUrl()}/management/probes`
      );

      expect(req.request.method).toBe("GET");
      req.flush(mockProbesResponse);
    });

    it("should handle http error", () => {
      const errorResponse = {
        status: 500,
        statusText: "Server Error",
      };
      service.getProbesInfo().subscribe(
        () => fail("expected an error, not probes info"),
        (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe("Server Error");
        }
      );

      const req = httpMock.expectOne(
        `${service["nuxeoJsClientService"].getApiUrl()}/management/probes`
      );

      expect(req.request.method).toBe("GET");
      req.flush(null, errorResponse);
    });
    
  });

  it("should convert a single word to title case", () => {
    const result = service.convertoTitleCase("hello");
    expect(result).toBe("Hello");
  });

  it("should convert multiple words to title case", () => {
    const result = service.convertoTitleCase("hello world");
    expect(result).toBe("Hello World");
  });

  it("should handle mixed case words", () => {
    const result = service.convertoTitleCase("hElLo WoRlD");
    expect(result).toBe("Hello World");
  });

  it("should handle empty string", () => {
    const result = service.convertoTitleCase("");
    expect(result).toBe("");
  });
});
