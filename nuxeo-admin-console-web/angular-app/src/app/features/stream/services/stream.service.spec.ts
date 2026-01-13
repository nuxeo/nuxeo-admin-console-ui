import { initializeTestBed } from "src/test-helpers"; //This import must be the first import in the file.
import {
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  type MockedObject,
  vi,
} from "vitest";
import { TestBed } from "@angular/core/testing";
import { StreamService } from "./stream.service";
import { NetworkService } from "../../../shared/services/network.service";
import { provideMockStore } from "@ngrx/store/testing";
import { of, throwError } from "rxjs";
import { RecordsPayload } from "../stream.interface";
import { CustomSnackBarComponent } from "../../../shared/components/custom-snack-bar/custom-snack-bar.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { REST_END_POINTS } from "../../../shared/constants/rest-end-ponts.constants";
describe("StreamService", () => {
  // Initialize TestBed for component testing
  initializeTestBed();

  let service: StreamService;
  let networkServiceMock: MockedObject<NetworkService>;
  const initialState = {};
  let snackBarSpy: Mock;

  beforeEach(() => {
    const networkServiceSpy = {
      makeHttpRequest: vi.fn().mockName("NetworkService.makeHttpRequest"),
      getAPIEndpoint: vi.fn().mockName("NetworkService.getAPIEndpoint"),
    };
    snackBarSpy = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        StreamService,
        { provide: NetworkService, useValue: networkServiceSpy },
        provideMockStore({ initialState }),
        {
          provide: MatSnackBar,
          useValue: { openFromComponent: snackBarSpy },
        },
      ],
    });

    service = TestBed.inject(StreamService);
    networkServiceMock = TestBed.inject(
      NetworkService
    ) as MockedObject<NetworkService>;
  });

  describe("getStreams", () => {
    it("should return an array of streams on success", async () => {
      const mockStreams = [{ name: "stream1" }, { name: "stream2" }];
      networkServiceMock.makeHttpRequest.mockReturnValue(of(mockStreams));

      service.getStreams().subscribe((streams) => {
        expect(streams).toEqual(mockStreams);
      });
    });

    it("should return an error when the network request fails", async () => {
      const error = new Error("Network error");
      networkServiceMock.makeHttpRequest.mockReturnValue(
        throwError(() => error)
      );

      service.getStreams().subscribe({
        error: (err) => {
          expect(err).toEqual(error);
        },
      });
    });
  });

  describe("startSSEStream", () => {
    it("should handle onmessage event correctly", () => {
      vi.useFakeTimers();
      const mockEventSource = {
        close: vi.fn(),
      };
      Object.defineProperty(mockEventSource, "onmessage", {
        set: vi.fn().mockImplementation((handler) => {
          setTimeout(
            () => handler({ data: JSON.stringify({ message: "data" }) }),
            0
          );
        }),
      });
      // Mock EventSource constructor (standard pattern for browser APIs)
      (window as any).EventSource = class {
        constructor() {
          return mockEventSource as any;
        }
      };
      const params: RecordsPayload = {
        stream: "stream1",
        rewind: "false",
        limit: "10",
        timeout: "30",
      };
      const mockData = { message: "data" };
      let receivedData: unknown;
      service.startSSEStream(params).subscribe({
        next: (data) => {
          receivedData = data;
        },
        error: (err) => {
          throw new Error("Expected success, but received error: " + err);
        },
      });
      vi.runAllTimers();
      expect(receivedData).toEqual(mockData);
      vi.useRealTimers();
    });

    it("should handle onerror event correctly", () => {
      vi.useFakeTimers();
      const mockEventSource = {
        onmessage: vi.fn(),
        onerror: vi.fn(),
        close: vi.fn(),
        addEventListener: vi.fn(),
      };
      // Mock EventSource constructor (standard pattern for browser APIs)
      (window as any).EventSource = class {
        constructor() {
          return mockEventSource as any;
        }
      };
      const params: RecordsPayload = {
        stream: "stream1",
        rewind: "false",
        limit: "10",
        timeout: "30",
      };
      const mockError = new Error("Stream error");
      service.startSSEStream(params).subscribe({
        next: () => {
          throw new Error("Expected error, but received data");
        },
        error: (err) => {
          expect(err).toEqual(mockError);
        },
      });
      mockEventSource.onerror(mockError);
      vi.runAllTimers();
      vi.useRealTimers();
    });

    it("should close the stream on stopSSEStream call", () => {
      vi.useFakeTimers();
      const mockEventSource = {
        close: vi.fn(),
      };
      // Mock EventSource constructor (standard pattern for browser APIs)
      (window as any).EventSource = class {
        constructor() {
          return mockEventSource as any;
        }
      };
      const params: RecordsPayload = {
        stream: "stream1",
        rewind: "false",
        limit: "10",
        timeout: "30",
      };
      const stopStreamSpy = vi.spyOn(service, "stopSSEStream");

      service.startSSEStream(params).subscribe();
      service.stopSSEStream();
      vi.runAllTimers();

      expect(mockEventSource.close).toHaveBeenCalled();
      expect(stopStreamSpy).toHaveBeenCalled();
      vi.useRealTimers();
    });
  });
  describe("showSuccessMessage", () => {
    it("should display a success message with the correct configuration", () => {
      const message = "Operation successful";
      service.showSuccessMessage(message);
      expect(snackBarSpy).toHaveBeenCalledWith(CustomSnackBarComponent, {
        data: {
          message: message,
          panelClass: "success-snack",
        },
        duration: 5000,
        panelClass: ["success-snack"],
      });
    });
  });

  describe("getConsumers", () => {
    it("should return an error when the network request fails", async () => {
      const error = new Error("Network error");
      const params = { stream: "mock-stream" };
      networkServiceMock.makeHttpRequest.mockReturnValue(
        throwError(() => error)
      );
      service.getConsumers(params).subscribe({
        error: (err) => {
          expect(err).toEqual(error);
        },
      });
    });
  });

  describe("startConsumerThreadPool", () => {
    it("should call the network service with correct parameters", async () => {
      const params = { stream: "mock-stream" };
      networkServiceMock.makeHttpRequest.mockReturnValue(of(void 0));
      service.startConsumerThreadPool(params).subscribe(() => {
        expect(networkServiceMock.makeHttpRequest).toHaveBeenCalledWith(
          REST_END_POINTS.START_CONSUMER_THREAD_POOL,
          { queryParam: params }
        );
      });
    });

    it("should handle errors correctly", async () => {
      const error = new Error("Network error");
      const params = { stream: "mock-stream" };
      networkServiceMock.makeHttpRequest.mockReturnValue(
        throwError(() => error)
      );

      service.startConsumerThreadPool(params).subscribe({
        error: (err) => {
          expect(err).toEqual(error);
        },
      });
    });
  });

  describe("stopConsumerThreadPool", () => {
    it("should call the network service with correct parameters", async () => {
      const params = { stream: "mock-stream" };
      networkServiceMock.makeHttpRequest.mockReturnValue(of(void 0));

      service.stopConsumerThreadPool(params).subscribe(() => {
        expect(networkServiceMock.makeHttpRequest).toHaveBeenCalledWith(
          REST_END_POINTS.STOP_CONSUMER_THREAD_POOL,
          { queryParam: params }
        );
      });
    });

    it("should handle errors correctly", async () => {
      const error = new Error("Network error");
      const params = { stream: "mock-stream" };
      networkServiceMock.makeHttpRequest.mockReturnValue(
        throwError(() => error)
      );

      service.stopConsumerThreadPool(params).subscribe({
        error: (err) => {
          expect(err).toEqual(error);
        },
      });
    });
  });

  describe("getScalingAnalysis", () => {
    it("should call makeHttpRequest with GET_SCALING_ANALYSIS and return data", async () => {
      const mockResult = { mockdata: "test", count: 1 };
      networkServiceMock.makeHttpRequest.mockReturnValue(of(mockResult));
      service.getScalingAnalysis().subscribe({
        next: (res) => {
          expect(res).toEqual(mockResult);
          expect(networkServiceMock.makeHttpRequest).toHaveBeenCalledTimes(1);
          expect(networkServiceMock.makeHttpRequest).toHaveBeenCalledWith(
            REST_END_POINTS.GET_SCALING_ANALYSIS
          );
        },
        error: () => {
          throw new Error("Expected successful response, but got error");
        },
      });
    });

    it("should propagate error when makeHttpRequest throws", async () => {
      const mockError = new Error("Network failure");
      networkServiceMock.makeHttpRequest.mockReturnValue(
        throwError(() => mockError)
      );
      service.getScalingAnalysis().subscribe({
        next: () => {
          throw new Error("Expected error, but got success");
        },
        error: (err) => {
          expect(err).toBe(mockError);
          expect(networkServiceMock.makeHttpRequest).toHaveBeenCalledWith(
            REST_END_POINTS.GET_SCALING_ANALYSIS
          );
        },
      });
    });
  });
});
