import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ProbesResponse } from "../../../shared/types/probes.interface";
import { REST_END_POINTS } from "../../../shared/constants/rest-end-ponts.constants";
import { NetworkService } from "../../../shared/services/network.service";


@Injectable({
  providedIn: "root",
})
export class ProbeService {
  

  constructor(
    private networkService: NetworkService
  ) {}


  getProbesInfo(): Observable<ProbesResponse> {
    return this.networkService.makeHttpRequest<ProbesResponse>(
      REST_END_POINTS.PROBES
    );
  }

  convertoTitleCase(word: string) {
    return word
      ?.toLowerCase()
      ?.split(" ")
      ?.map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1))
      ?.join(" ");
  }

}
