import { EventEmitter, Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { Observable } from "rxjs";
import { REST_END_POINTS } from "../constants/rest-end-ponts.constants";
import { NetworkService } from "./network.service";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  loadApp = new EventEmitter<boolean>();
  constructor(private router: Router, private networkService: NetworkService) {}

  redirectToBulkActionMonitoring(commandId: string): void {
    this.router.navigate(["/bulk-action-monitoring", commandId]);
  }

  redirectToProbesDetails(): void {
    this.router.navigate(["/probes"]);
  }

  getConfigurationDetails(): Observable<any> {
    return this.networkService.makeHttpRequest<any>(
      REST_END_POINTS.GET_CONFIGURATION_DETAILS
    );
  }
}
