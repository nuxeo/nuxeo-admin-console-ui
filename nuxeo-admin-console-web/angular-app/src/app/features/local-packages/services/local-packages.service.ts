import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { LocalPackagesResponse } from "../../../shared/types/local-packages.interface";
import { REST_END_POINTS } from "../../../shared/constants/rest-end-ponts.constants";
import { NetworkService } from "../../../shared/services/network.service";

@Injectable({
  providedIn: "root",
})
export class LocalPackagesService {
  private networkService = inject(NetworkService);

  getLocalPackages(): Observable<LocalPackagesResponse> {
    return this.networkService.makeHttpRequest<LocalPackagesResponse>(
      REST_END_POINTS.GET_LOCAL_PACKAGES
    );
  }
}
