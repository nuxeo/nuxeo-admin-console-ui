import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { UserInterface } from "../../shared/types/user.interface";
import { AuthUserResponseInterface } from "../types/authResponse.interface";
import { NuxeoJSClientService } from "../../shared/services/nuxeo-js-client.service";
import { REST_END_POINTS } from "../../shared/constants/rest-end-ponts.constants";
import { NetworkService } from "../../shared/services/network.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private nuxeoJsClientService: NuxeoJSClientService,
    private networkService: NetworkService
  ) {}

  getCurrentUser(): Observable<UserInterface> {
    return this.networkService
      .makeHttpRequest<AuthUserResponseInterface>(
        REST_END_POINTS.CURRENT_USER
      )
      .pipe(map((response) => this.getUser(response)));
  }

  getUser(response: AuthUserResponseInterface): UserInterface {
    return {
      id: response?.id,
      properties: {
        firstName: response?.properties?.firstName,
        lastName: response?.properties?.lastName,
        email: response?.properties?.email,
        username: response?.properties?.username,
      },
      isAdministrator: response?.isAdministrator,
    };
  }

  signOut(): Observable<void> {
    return this.networkService.makeHttpRequest<void>(REST_END_POINTS.LOGOUT);
  }
}