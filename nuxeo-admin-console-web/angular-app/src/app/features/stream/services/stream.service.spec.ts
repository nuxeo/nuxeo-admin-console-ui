import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { StreamService } from './stream.service';
import { NetworkService } from '../../../shared/services/network.service';
import { provideMockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';
import { RecordsPayload } from '../stream.interface';
import { CustomSnackBarComponent } from '../../../shared/components/custom-snack-bar/custom-snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { REST_END_POINTS } from '../../../shared/constants/rest-end-ponts.constants';

describe('StreamService', () => {
    let service: StreamService;
    let networkServiceMock: jasmine.SpyObj<NetworkService>;
    const initialState = {};
    let snackBarSpy: jasmine.Spy;

    beforeEach(() => {
      const networkServiceSpy = jasmine.createSpyObj("NetworkService", [
        "makeHttpRequest",
        "getAPIEndpoint",
      ]);
      snackBarSpy = jasmine.createSpy("openFromComponent");

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
      ) as jasmine.SpyObj<NetworkService>;
    });

    describe('getStreams', () => {
        it('should return an array of streams on success', (done) => {
            const mockStreams = [{ name: 'stream1' }, { name: 'stream2' }];
            networkServiceMock.makeHttpRequest.and.returnValue(of(mockStreams));

            service.getStreams().subscribe((streams) => {
                expect(streams).toEqual(mockStreams);
                done();
            });
        });

        it('should return an error when the network request fails', (done) => {
            const error = new Error('Network error');
            networkServiceMock.makeHttpRequest.and.returnValue(throwError(() => error));

            service.getStreams().subscribe({
                error: (err) => {
                    expect(err).toEqual(error);
                    done();
                }
            });
        });
    });

    describe('startSSEStream', () => {
        it('should handle onmessage event correctly', fakeAsync(() => {
            const mockEventSource = {
                close: jasmine.createSpy('close'),
            };
            Object.defineProperty(mockEventSource, 'onmessage', {
                set: jasmine.createSpy('onmessage').and.callFake((handler) => {
                    setTimeout(() => handler({ data: JSON.stringify({ message: 'data' }) }), 0);
                }),
            });
            spyOn(window, 'EventSource').and.returnValue(mockEventSource as unknown as EventSource);
            const params: RecordsPayload = {
                stream: 'stream1',
                rewind: 'false',
                limit: '10',
                timeout: '30',
            };
            const mockData = { message: 'data' };
            let receivedData: unknown;
            service.startSSEStream(params).subscribe({
                next: (data) => {
                    receivedData = JSON.parse(data as string);
                },
                error: (err) => {
                    fail('Expected success, but received error: ' + err);
                }
            });
            tick();
            expect(receivedData).toEqual(mockData);
        }));

        it('should handle onerror event correctly', fakeAsync(() => {
            const mockEventSource = {
                onmessage: jasmine.createSpy('onmessage'),
                onerror: jasmine.createSpy('onerror'),
                close: jasmine.createSpy('close'),
                addEventListener: jasmine.createSpy('addEventListener')
            };
            spyOn(window, 'EventSource').and.returnValue(mockEventSource as unknown as EventSource);
            const params: RecordsPayload = {
                stream: 'stream1',
                rewind: 'false',
                limit: '10',
                timeout: '30',
            };
            const mockError = new Error('Stream error');
            service.startSSEStream(params).subscribe({
                next: () => {
                    fail('Expected error, but received data');
                },
                error: (err) => {
                    expect(err).toEqual(mockError);
                }
            });
            mockEventSource.onerror(mockError);
            tick();
        }));

        it('should close the stream on stopSSEStream call', fakeAsync(() => {
            const mockEventSource = {
                close: jasmine.createSpy('close'),
            };
            spyOn(window, 'EventSource').and.returnValue(mockEventSource as unknown as EventSource);
            const params: RecordsPayload = {
                stream: 'stream1',
                rewind: 'false',
                limit: '10',
                timeout: '30',
            };
            const stopStreamSpy = spyOn(service, 'stopSSEStream').and.callThrough();

            service.startSSEStream(params).subscribe();
            service.stopSSEStream();
            tick();

            expect(mockEventSource.close).toHaveBeenCalled();
            expect(stopStreamSpy).toHaveBeenCalled();
        }));
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
      it("should return an error when the network request fails", (done) => {
        const error = new Error("Network error");
        const params = { stream: "mock-stream" };
        networkServiceMock.makeHttpRequest.and.returnValue(
          throwError(() => error)
        );
        service.getConsumers(params).subscribe({
          error: (err) => {
            expect(err).toEqual(error);
            done();
          },
        });
      });
    });

    describe("startConsumerThreadPool", () => {
      it("should call the network service with correct parameters", (done) => {
        const params = { stream: "mock-stream" };
        networkServiceMock.makeHttpRequest.and.returnValue(of(void 0));
        service.startConsumerThreadPool(params).subscribe(() => {
          expect(networkServiceMock.makeHttpRequest).toHaveBeenCalledWith(
            REST_END_POINTS.START_CONSUMER_THREAD_POOL,
            { queryParam: params }
          );
          done();
        });
      });

      it("should handle errors correctly", (done) => {
        const error = new Error("Network error");
        const params = { stream: "mock-stream" };
        networkServiceMock.makeHttpRequest.and.returnValue(
          throwError(() => error)
        );

        service.startConsumerThreadPool(params).subscribe({
          error: (err) => {
            expect(err).toEqual(error);
            done();
          },
        });
      });
    });

    describe("stopConsumerThreadPool", () => {
      it("should call the network service with correct parameters", (done) => {
        const params = { stream: "mock-stream" };
        networkServiceMock.makeHttpRequest.and.returnValue(of(void 0));

        service.stopConsumerThreadPool(params).subscribe(() => {
          expect(networkServiceMock.makeHttpRequest).toHaveBeenCalledWith(
            REST_END_POINTS.STOP_CONSUMER_THREAD_POOL,
            { queryParam: params }
          );
          done();
        });
      });

      it("should handle errors correctly", (done) => {
        const error = new Error("Network error");
        const params = { stream: "mock-stream" };
        networkServiceMock.makeHttpRequest.and.returnValue(
          throwError(() => error)
        );

        service.stopConsumerThreadPool(params).subscribe({
          error: (err) => {
            expect(err).toEqual(error);
            done();
          },
        });
      });
    });
});
