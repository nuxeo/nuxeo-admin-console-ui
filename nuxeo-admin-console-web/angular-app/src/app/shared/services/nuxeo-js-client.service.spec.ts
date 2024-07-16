import { TestBed } from "@angular/core/testing";
import { NuxeoJSClientService } from "./nuxeo-js-client.service";

describe("NuxeoJSClientService", () => {
  let service: NuxeoJSClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NuxeoJSClientService],
    });
    service = TestBed.inject(NuxeoJSClientService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should initialize Nuxeo instance on initiateJSClient", () => {
    service.initiateJSClient();
    expect(service.getNuxeoInstance()).toBeDefined();
  });

  it("should return base URL from Nuxeo instance", () => {
    service.initiateJSClient();
    const baseUrl = service.getBaseUrl();
    expect(baseUrl).toBeDefined();
  });

  it("should return API URL from Nuxeo instance", () => {
    service.initiateJSClient();
    const apiUrl = service.getApiUrl();
    expect(apiUrl).toBeDefined();
  });
});
