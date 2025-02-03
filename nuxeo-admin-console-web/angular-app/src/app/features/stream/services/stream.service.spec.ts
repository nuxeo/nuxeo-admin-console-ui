import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { StreamService } from './stream.service';
import { NetworkService } from '../../../shared/services/network.service';
import { provideMockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';

describe('StreamService', () => {
    let service: StreamService;
    let networkServiceMock: jasmine.SpyObj<NetworkService>;
    const initialState = {};

    beforeEach(() => {
        const networkServiceSpy = jasmine.createSpyObj('NetworkService', ['makeHttpRequest', 'getAPIEndpoint']);

        TestBed.configureTestingModule({
            providers: [
                StreamService,
                { provide: NetworkService, useValue: networkServiceSpy },
                provideMockStore({ initialState })
            ]
        });

        service = TestBed.inject(StreamService);
        networkServiceMock = TestBed.inject(NetworkService) as jasmine.SpyObj<NetworkService>;
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

    describe('getConsumers', () => {
        it('should return an array of consumers on success', (done) => {
            const mockConsumers = [{ stream: 'stream1', consumer: 'consumer1' }];
            const params = { streamId: '123' };
            networkServiceMock.makeHttpRequest.and.returnValue(of(mockConsumers));

            service.getConsumers(params).subscribe((consumers) => {
                expect(consumers).toEqual(mockConsumers);
                done();
            });
        });

        it('should return an error when the network request fails', (done) => {
            const error = new Error('Network error');
            const params = { streamId: '123' };
            networkServiceMock.makeHttpRequest.and.returnValue(throwError(() => error));

            service.getConsumers(params).subscribe({
                error: (err) => {
                    expect(err).toEqual(error);
                    done();
                }
            });
        });
    });

    describe('getRecords', () => {
        it('should return an array of records on success', (done) => {
            const mockRecords = [{ recordId: 1, data: 'record1' }];
            const params = { filter: 'active' };
            networkServiceMock.makeHttpRequest.and.returnValue(of(mockRecords));

            service.getRecords(params).subscribe((records) => {
                expect(records).toEqual(mockRecords);
                done();
            });
        });

        it('should return an error when the network request fails', (done) => {
            const error = new Error('Network error');
            const params = { filter: 'active' };
            networkServiceMock.makeHttpRequest.and.returnValue(throwError(() => error));

            service.getRecords(params).subscribe({
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

            const params = { streamId: '12345' };
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

            const params = { streamId: '12345' };
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
    });


    describe('appendParamsToUrl', () => {
        it('should append parameters to the URL correctly', () => {
            const baseUrl = 'http://abc.com';
            const params = { param1: 'value1', param2: 'value2' };
            const urlWithParams = service['appendParamsToUrl'](baseUrl, params);
            expect(urlWithParams).toBe('http://abc.com?param1=value1&param2=value2');
        });
    });
});
