import { TestBed } from "@angular/core/testing";
import { NuxeoJSClientService } from "./nuxeo-js-client.service";

describe("NuxeoJSClientService", () => {
  let service: NuxeoJSClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NuxeoJSClientService],
    });
    service = TestBed.inject(NuxeoJSClientService);
    service.initiateJSClient("/nuxeo");
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should initialize Nuxeo instance on initiateJSClient", () => {
    expect(service.getNuxeoInstance()).toBeDefined();
  });

  it("should return base URL from Nuxeo instance", () => {
    const baseUrl = service.getBaseUrl();
    expect(baseUrl).toBeDefined();
  });

  it("should return API URL from Nuxeo instance", () => {
    const apiUrl = service.getApiUrl();
    expect(apiUrl).toBeDefined();
  });
});
