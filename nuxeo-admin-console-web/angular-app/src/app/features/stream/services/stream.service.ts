import { REST_END_POINTS } from "./../../../shared/constants/rest-end-ponts.constants";
import { Injectable } from "@angular/core";
import { NetworkService } from "../../../shared/services/network.service";
import { BehaviorSubject, Observable } from "rxjs";
import { Stream } from "../stream.interface";

@Injectable({
  providedIn: "root",
})
export class StreamService {
  isFetchingRecords: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(private networkService: NetworkService) { }
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

  getRecords(params: { [key: string]: string | number | boolean }): Observable<unknown[]> {
    return this.networkService.makeHttpRequest<unknown[]>(
      REST_END_POINTS.STREAM_RECORDS,
      {
        queryParam: params
      }
    );
  }

  startSSEStream(params: Record<string, unknown>) {
    const url = this.networkService.getAPIEndpoint(
      REST_END_POINTS.STREAM_RECORDS
    );
    const fullUrl = this.appendParamsToUrl(url, params);
    return new Observable((observer) => {
      const eventSource = new EventSource(fullUrl, { withCredentials: true });
      eventSource.onmessage = (event) => {
        observer.next(event.data);
      };
      eventSource.onerror = (error) => {
        observer.error(error);
      };
      return () => {
        eventSource.close();
      };
    });
  }

  private appendParamsToUrl(url: string, params: Record<string, unknown>) {
    const queryString = new URLSearchParams(this.convertObjToString(params))?.toString();
    return `${url}?${queryString}`;
  }

  private convertObjToString(params: Record<string, unknown>): Record<string, string> {
    return Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  }
}