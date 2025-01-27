import { REST_END_POINTS } from "./../../../shared/constants/rest-end-ponts.constants";
import { Injectable } from "@angular/core";
import { NetworkService } from "../../../shared/services/network.service";
import { Observable } from "rxjs";
import { Stream } from "../stream.interface";
import * as StreamActions from "../store/actions";
import { Store } from "@ngrx/store";

@Injectable({
  providedIn: "root",
})
export class StreamService {
  constructor(private networkService: NetworkService, private store: Store) {}
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

  getRecords(
    params: { [key: string]: string | number | boolean }
  ): Observable<unknown[]> {
    return this.networkService.makeHttpRequest<unknown[]>(
      REST_END_POINTS.STREAM_RECORDS,
      {
        queryParam: params
      }
    );
  }

  startSSEStream(params: Record<string, unknown>) {
    // Use networkService to get the correct URL for the endpoint
    const url = this.networkService.getAPIEndpoint(
      REST_END_POINTS.STREAM_RECORDS
    );

    // You can now use the URL and params to start the SSE stream
    const fullUrl = this.appendParamsToUrl(url, params);

    return new Observable((observer) => {
      const eventSource = new EventSource(fullUrl, { withCredentials: true});

      eventSource.onmessage = (event) => {
        observer.next(event.data);
      };

      eventSource.onerror = (error) => {
        observer.error(error);
      };

      // Cleanup when the observable is unsubscribed
      return () => {
        eventSource.close();
      };
    });
  }

  // Helper method to append params to URL
  private appendParamsToUrl(url: string, params: Record<string, unknown>) {
    const queryString = new URLSearchParams(params as any).toString();
    return `${url}?${queryString}`;
  }
}
