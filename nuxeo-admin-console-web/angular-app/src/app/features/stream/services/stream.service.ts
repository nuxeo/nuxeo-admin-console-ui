import { REST_END_POINTS } from "./../../../shared/constants/rest-end-ponts.constants";
import { Injectable } from "@angular/core";
import { NetworkService } from "../../../shared/services/network.service";
import { BehaviorSubject, Observable, of } from "rxjs";
import { RecordsPayload, Stream } from "../stream.interface";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CustomSnackBarComponent } from "../../../shared/components/custom-snack-bar/custom-snack-bar.component";
import { ChangeConsumerPosition, ConsumerPositionDetails } from "../components/consumer-position/store/reducers";

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
  private streamDisconnectedSubject = new BehaviorSubject<boolean>(false);
  streamDisconnected$ = this.streamDisconnectedSubject.asObservable();
  private eventSource?: EventSource;

  constructor(
    private networkService: NetworkService,
    private _snackBar: MatSnackBar
  ) {}

  getStreams(): Observable<Stream[]> {
    return this.networkService.makeHttpRequest<Stream[]>(
      REST_END_POINTS.STREAM
    );
  }

  getConsumers(params: {
    [key: string]: string;
  }): Observable<{ stream: string; consumer: string }[]> {
    return this.networkService.makeHttpRequest<
      { stream: string; consumer: string }[]
    >(REST_END_POINTS.STREAM_CONSUMERS, { queryParam: params });
  }

  startSSEStream(params: RecordsPayload) {
    const url = this.networkService.getAPIEndpoint(
      REST_END_POINTS.STREAM_RECORDS
    );
    const fullUrl = this.appendParamsToUrl(url, params);
    this.streamDisconnectedSubject.next(false);
    return new Observable((observer) => {
      this.eventSource = new EventSource(fullUrl, { withCredentials: true });

      this.eventSource.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        if (parsedData && parsedData.type) {
          this.streamDisconnectedSubject.next(true);
        }
        observer.next(event.data);
      };

      this.eventSource.onerror = (error) => {
        observer.error(error);
      };

      return () => {
        this.eventSource?.close();
        this.eventSource = undefined;
      };
    });
  }

  stopSSEStream(): Observable<void> {
    this.eventSource?.close();
    this.eventSource = undefined;
    return of(void 0);
  }

  private appendParamsToUrl(url: string, params: RecordsPayload) {
    const queryString = new URLSearchParams(
      this.convertObjToString(params)
    )?.toString();
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

  startConsumerThreadPool(params: { [key: string]: string }): Observable<void> {
    return this.networkService.makeHttpRequest<void>(
      REST_END_POINTS.START_CONSUMER_THREAD_POOL,
      { queryParam: params }
    );
  }
  stopConsumerThreadPool(params: { [key: string]: string }): Observable<void> {
    return this.networkService.makeHttpRequest<void>(
      REST_END_POINTS.STOP_CONSUMER_THREAD_POOL,
      { queryParam: params }
    );
  }

  changeConsumerPosition(
    consumerPosition: string,
    params: { [key: string]: string }
  ): Observable<ChangeConsumerPosition[]> {
    return this.networkService.makeHttpRequest<ChangeConsumerPosition[]>(
      REST_END_POINTS.CHANGE_CONSUMER_POSITION,
      { urlParam: { consumerPosition }, queryParam: params }
    );
  }

  fetchConsumerPosition(
    params: { [key: string]: string }
  ): Observable<ConsumerPositionDetails[]> {
    return this.networkService.makeHttpRequest<ConsumerPositionDetails[]>(
      REST_END_POINTS.FETCH_CONSUMER_POSITION,
      { queryParam: params }
    );
  }

 getScalingAnalysis(): Observable<any> {
    return this.networkService.makeHttpRequest<any>(
      REST_END_POINTS.GET_SCALING_ANALYSIS
    );
  }

  getStreamProcessorInfo(): Observable<any> {
    return this.networkService.makeHttpRequest<any>(
      REST_END_POINTS.GET_STREAM_PROCESSOR_INFO
    );
  }

  showSuccessMessage(message: string): void {
    //Shared method to show success messages
    this._snackBar.openFromComponent(CustomSnackBarComponent, {
      data: {
        message: message,
        panelClass: "success-snack",
      },
      duration: 5000,
      panelClass: ["success-snack"],
    });
  }
}
