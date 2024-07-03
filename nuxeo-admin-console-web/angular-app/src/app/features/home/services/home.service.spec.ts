import { TestBed } from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import { HomeService } from "./home.service";
import { environment } from "../../../../environments/environment";
import { versionInfo } from "../../../shared/types/version-info.interface";

describe("HomeService", () => {
  let service: HomeService;
  let httpMock: HttpTestingController;

  const mockVersionInfo: versionInfo = {
    version: "Nuxeo Platform 2021.45.8",
    clusterEnabled: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HomeService],
    });

    service = TestBed.inject(HomeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("getVersionInfo", () => {
    it("should fetch version info and handle http error", () => {
      service.getVersionInfo().subscribe(
        (data) => {
          expect(data).toEqual(mockVersionInfo);
        },
        (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe("Server Error");
        }
      );

      const req = httpMock.expectOne(`${environment.apiUrl}/version-info.json`);
      req.flush(mockVersionInfo);
      httpMock.verify();
      expect(req.request.method).toBe("GET");
    });
  });
});
