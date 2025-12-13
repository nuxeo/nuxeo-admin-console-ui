import { EventEmitter, Injectable, inject } from "@angular/core";
import { Router } from '@angular/router';
import { Observable } from "rxjs";
import { REST_END_POINTS } from "../constants/rest-end-ponts.constants";
import { NetworkService } from "./network.service";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  private router = inject(Router);
  private networkService = inject(NetworkService);
  loadApp = new EventEmitter<boolean>();

  redirectToBulkActionMonitoring(commandId: string): void {
    this.router.navigate(["/bulk-action-monitoring", commandId]);
  }

  redirectToProbesDetails(): void {
    this.router.navigate(["/probes"]);
  }

  getConfigurationDetails(): Observable<unknown> {
    return this.networkService.makeHttpRequest<unknown>(
      REST_END_POINTS.GET_CONFIGURATION_DETAILS
    );
  }
}
