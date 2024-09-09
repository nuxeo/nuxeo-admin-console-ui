import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ProbesResponse } from "../../../../shared/types/probes.interface";
import { REST_END_POINTS } from "../../../../shared/constants/rest-end-ponts.constants";
import { NetworkService } from "../../../../shared/services/network.service";
import { NuxeoJSClientService } from "../../../../shared/services/nuxeo-js-client.service";

@Injectable({
  providedIn: "root",
})
export class ProbeDataService {
  constructor(private networkService: NetworkService,private nuxeoJsClientService: NuxeoJSClientService) {}

  getProbesInfo(): Observable<ProbesResponse> {
    return this.networkService.makeHttpRequest<ProbesResponse>(
      REST_END_POINTS.PROBES
    );
  }

  formatToTitleCase(text: string): string {
    return text
      ?.toLowerCase()
      ?.split(" ")
      ?.map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1))
      ?.join(" ");
  }
}
