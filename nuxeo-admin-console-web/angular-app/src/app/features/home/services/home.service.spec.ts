import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { HomeService } from "./home.service";
import { CapabilitiesResponse } from "../../../shared/types/capabilities.interface";

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
});
