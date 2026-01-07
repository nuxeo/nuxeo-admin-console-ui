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
import { BulkActionMonitoringService } from "./bulk-action-monitoring.service";
import { NetworkService } from "./../../../shared/services/network.service";
import { REST_END_POINTS } from "./../../../shared/constants/rest-end-ponts.constants";
describe("BulkActionMonitoringService", () => {
  initializeTestBed();

  let service: BulkActionMonitoringService;
  let networkService: MockedObject<NetworkService>;

  beforeEach(() => {
    const spy = {
      makeHttpRequest: vi.fn().mockName("NetworkService.makeHttpRequest"),
    };

    TestBed.configureTestingModule({
      providers: [
        BulkActionMonitoringService,
        { provide: NetworkService, useValue: spy },
      ],
    });

    service = TestBed.inject(BulkActionMonitoringService);
    networkService = TestBed.inject(
      NetworkService
    ) as MockedObject<NetworkService>;
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("performBulkActionMonitoring", () => {
    it("should call makeHttpRequest with the correct endpoint and parameters", () => {
      const mockId = "123";
      service.performBulkActionMonitoring(mockId);
      expect(networkService.makeHttpRequest).toHaveBeenCalledWith(
        REST_END_POINTS.BULK_ACTION_MONITORING,
        { urlParam: { id: mockId } }
      );
    });

    it("should handle null id", () => {
      service.performBulkActionMonitoring(null);
      expect(networkService.makeHttpRequest).toHaveBeenCalledWith(
        REST_END_POINTS.BULK_ACTION_MONITORING,
        { urlParam: { id: null } }
      );
    });
  });

  describe("pageTitle", () => {
    it("should have an initial value of an empty string", () => {
      service.pageTitle.subscribe((value) => {
        expect(value).toBe("");
      });
    });

    it("should update the value correctly", () => {
      const newTitle = "New Page Title";
      service.pageTitle.next(newTitle);

      service.pageTitle.subscribe((value) => {
        expect(value).toBe(newTitle);
      });
    });
  });
});
