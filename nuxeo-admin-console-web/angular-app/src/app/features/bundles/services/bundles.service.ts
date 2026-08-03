import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { DistributionResponse } from "../../../shared/types/bundles.interface";
import { REST_END_POINTS } from "../../../shared/constants/rest-end-ponts.constants";
import { NetworkService } from "../../../shared/services/network.service";

@Injectable({
  providedIn: "root",
})
export class BundlesService {
  private readonly networkService = inject(NetworkService);

  getDistributionInfo(): Observable<DistributionResponse> {
    return this.networkService.makeHttpRequest<DistributionResponse>(
      REST_END_POINTS.GET_DISTRIBUTION_INFO
    );
  }
}
