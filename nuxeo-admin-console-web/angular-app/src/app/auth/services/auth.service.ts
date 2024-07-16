import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { UserInterface } from "../../shared/types/user.interface";
import { AuthUserResponseInterface } from "../types/authResponse.interface";
import { HylandSSORequestInterface } from "../types/hylandSSORequest.interface";
import { NuxeoJSClientService } from "../../shared/services/nuxeo-js-client.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient, private nuxeoJsClientService: NuxeoJSClientService) { }


  getCurrentUser(): Observable<UserInterface> {
    const url = `${this.nuxeoJsClientService.getApiUrl()}/me`;
    return this.http.get<AuthUserResponseInterface>(url).pipe(
      map(response => this.getUser(response))
    );
  }

  getUser(response: AuthUserResponseInterface): UserInterface {
    return {
      id: response?.id,
      properties: {
        firstName: response?.properties?.firstName,
        lastName: response?.properties?.lastName,
        email: response?.properties?.email,
        username: response?.properties?.username
      },
      isAdministrator: response?.isAdministrator,
    };
  }

  sso(data: HylandSSORequestInterface): Observable<UserInterface> {
    const url = environment.apiUrl + "/users/sso";
    return this.http
      .post<AuthUserResponseInterface>(url, data)
      .pipe(map(this.getUser));
  }
  signOut(): Observable<void> {
    const url = `${this.nuxeoJsClientService.getBaseUrl()}/logout`;
    return this.http.get<void>(url, {});
  }

}



