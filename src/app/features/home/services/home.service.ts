import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { versionInfo } from "../../../shared/types/version-info.interface";

@Injectable({
  providedIn: "root",
})
export class HomeService {
  private readonly jsonFilePath = environment.apiUrl + "/version-info.json";

  constructor(private http: HttpClient) {}

  getversionInfo(): Observable<versionInfo> {
    return this.http.get<versionInfo>(this.jsonFilePath);
  }
}
