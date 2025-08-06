import { CapabilitiesResponse } from "./../../../shared/types/capabilities.interface";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { REST_END_POINTS } from "../../../shared/constants/rest-end-ponts.constants";
import { NetworkService } from "../../../shared/services/network.service";
import { MatDialogRef } from "@angular/material/dialog";
import { ErrorModalComponent } from "../../sub-features/generic-multi-feature-layout/components/error-modal/error-modal.component";
import { ErrorModalClosedInfo } from "src/app/shared/types/common.interface";
import { InstanceInfo } from "../../../shared/types/instanceInfo.interface";

@Injectable({
  providedIn: "root",
})
export class HomeService {
  errorDialogRef: MatDialogRef<ErrorModalComponent, ErrorModalClosedInfo> =
    {} as MatDialogRef<ErrorModalComponent, ErrorModalClosedInfo>;

  constructor(
    private networkService: NetworkService,
  ) {}

  getVersionInfo(): Observable<CapabilitiesResponse> {
    return this.networkService.makeHttpRequest<CapabilitiesResponse>(
      REST_END_POINTS.CAPABILITIES
    );
  }

  getInstanceInfo(): Observable<InstanceInfo> {
    return this.networkService.makeHttpRequest<InstanceInfo>(
      REST_END_POINTS.INSTANCE_INFO
    );
  }
}