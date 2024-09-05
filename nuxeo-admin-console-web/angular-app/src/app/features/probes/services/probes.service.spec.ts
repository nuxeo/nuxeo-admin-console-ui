import { TestBed } from "@angular/core/testing";
import { ProbeService } from "./probes.service";
import { ProbesResponse } from "../../../shared/types/probes.interface";
import { HttpTestingController,HttpClientTestingModule } from "@angular/common/http/testing";

describe("ProbeService", () => {
  let service: ProbeService;
  let httpMock: HttpTestingController;

  const mockProbesResponse: ProbesResponse = {
    entries: [
      {
        "entity-type": "probe",
        name: "ldapDirectories",
        status: {
          "entity-type": "probeStatus",
          neverExecuted: true,
          success: false,
          infos: {
            info: "[unavailable]"
          }
        },
        history: {
          lastRun: null,
          lastSuccess: "1970-01-01T00:00:00.000Z",
          lastFail: "1970-01-01T00:00:00.000Z"
        },
        counts: {
          run: 0,
          success: 0,
          failure: 0
        },
        time: 0
      },
      {
        "entity-type": "probe",
        name: "administrativeStatus",
        status: {
          "entity-type": "probeStatus",
          neverExecuted: true,
          success: false,
          infos: {
            info: "[unavailable]"
          }
        },
        history: {
          lastRun: null,
          lastSuccess: "1970-01-01T00:00:00.000Z",
          lastFail: "1970-01-01T00:00:00.000Z"
        },
        counts: {
          run: 0,
          success: 0,
          failure: 0
        },
        time: 0
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProbeService],
    });

    service = TestBed.inject(ProbeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  
  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("fetchProbesData", () => {
    it("should successfully fetch probe information", () => {
      service.getProbesInfo().subscribe((data) => {
        expect(data).toEqual(mockProbesResponse);
      });

      const req = httpMock.expectOne(
        `${service["nuxeoJsClientService"].getApiUrl()}/management/probes`
      );

      expect(req.request.method).toBe("GET");
      req.flush(mockProbesResponse);
    });

    it("should handle HTTP errors", () => {
      const errorResponse = {
        status: 500,
        statusText: "Server Error",
      };

      service.getProbesInfo().subscribe(
        () => fail("expected an error, not probes data"),
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
