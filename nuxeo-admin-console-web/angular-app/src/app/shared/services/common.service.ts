import { EventEmitter, Injectable } from "@angular/core";
import { Router } from '@angular/router';

@Injectable({
  providedIn: "root",
})
export class CommonService {
  loadApp = new EventEmitter<boolean>();
  constructor(private router: Router) {} 

  redirectToBulkActionMonitoring(commandId: string): void {
    this.router.navigate(["/bulk-action-monitoring", commandId]);
  }

  redirectToProbesDetails(): void {
    this.router.navigate(["/probes"]);
  }
}
