import { REST_END_POINTS } from "./../../../shared/constants/rest-end-ponts.constants";
import { NetworkService } from "./../../../shared/services/network.service";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { BulkActionMonitoringInfo } from "../bulk-action-monitoring.interface";
@Injectable({
  providedIn: "root",
})
export class BulkActionMonitoringService {
  pageTitle: BehaviorSubject<string> = new BehaviorSubject("");
  constructor(private networkService: NetworkService) {}
  performBulkActionMonitoring(id: string | null): Observable<BulkActionMonitoringInfo> {
    return this.networkService.makeHttpRequest<BulkActionMonitoringInfo>(
      REST_END_POINTS.BULK_ACTION_MONITORING,
      { urlParam: { id } }
    );
  }
}
