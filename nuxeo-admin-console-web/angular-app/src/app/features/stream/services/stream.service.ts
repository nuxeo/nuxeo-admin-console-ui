import { REST_END_POINTS } from "./../../../shared/constants/rest-end-ponts.constants";
import { Injectable } from "@angular/core";
import { NetworkService } from "../../../shared/services/network.service";
import { BehaviorSubject, Observable, of, Subject, take, takeUntil } from "rxjs";
import { RecordsPayload, Stream } from "../stream.interface";

@Injectable({
  providedIn: "root",
})
export class StreamService {
  isFetchingRecords: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isClearRecordsDisabled: BehaviorSubject<boolean> = new BehaviorSubject(true);
  isStopFetchDisabled: BehaviorSubject<boolean> = new BehaviorSubject(true);
  isViewRecordsDisabled: BehaviorSubject<boolean> = new BehaviorSubject(false);
  clearRecordsDisplay: BehaviorSubject<boolean> = new BehaviorSubject(false);
  recordsFetchedSuccess: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private eventSource?: EventSource;
  private streamStateSubject = new BehaviorSubject<boolean>(false);
  streamState$: Observable<boolean> = this.streamStateSubject.asObservable();

  private stopStream$ = new Subject<void>();
  constructor(private networkService: NetworkService) { }

  setStreamState(isActive: boolean): void {
    this.streamStateSubject.next(isActive);
  }
  
  getStreams(): Observable<Stream[]> {
    return this.networkService.makeHttpRequest<Stream[]>(
      REST_END_POINTS.STREAM
    );
  }

  getConsumers(params: { [key: string]: string; }): Observable<{ stream: string; consumer: string }[]> {
    return this.networkService.makeHttpRequest<
      { stream: string; consumer: string }[]
    >(REST_END_POINTS.STREAM_CONSUMERS, { queryParam: params });
  }

  startSSEStream(params: RecordsPayload): Observable<string> {
    const url = this.networkService.getAPIEndpoint(REST_END_POINTS.STREAM_RECORDS);
    const fullUrl = this.appendParamsToUrl(url, params);

    return new Observable((observer) => {
      console.log("✅ Starting new SSE connection...");

      this.eventSource = new EventSource(fullUrl, { withCredentials: true });

      this.eventSource.onmessage = (event) => {
        observer.next(event.data);
      };

      this.eventSource.onerror = (error) => {
        console.error("SSE error:", error);
        observer.error(error);
      };

      const stopSubscription = this.stopStream$.subscribe(() => {
        console.log("Stopping SSE connection...");
        this.eventSource?.close();
        this.eventSource = undefined;
        observer.complete();
      });

      return () => {
        console.log(" Ignoring early unsubscribe cleanup. SSE should stop via stopSSEStream().");
        stopSubscription.unsubscribe(); 
      };
    });
  }

  stopSSEStream() {
    if (this.eventSource) {
      console.log("Manually stopping SSE connection...");
      this.eventSource.close();
      this.eventSource = undefined;
    }
    this.stopStream$.next(); 
  }

  getStopStream$(): Observable<void> {
    return this.stopStream$.asObservable();
  }





  private appendParamsToUrl(url: string, params: RecordsPayload) {
    const queryString = new URLSearchParams(this.convertObjToString(params))?.toString();
    return `${url}?${queryString}`;
  }

  private convertObjToString(params: RecordsPayload): Record<string, string> {
    return Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>);
  }
}