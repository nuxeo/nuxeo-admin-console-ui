import { CapabilitiesResponse } from "./../../../shared/types/capabilities.interface";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { REST_END_POINTS } from "../../../shared/constants/rest-end-ponts.constants";
import { NetworkService } from "../../../shared/services/network.service";
import { InstanceInfo } from "../../../shared/types/instanceInfo.interface";

@Injectable({
  providedIn: "root",
})
export class HomeService {

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