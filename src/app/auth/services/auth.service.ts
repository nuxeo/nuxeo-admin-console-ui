import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { UserInterface } from "../../shared/types/user.interface";
import { AuthResponseInterface } from "../types/authResponse.interface";
import { HylandSSORequestInterface } from "../types/hylandSSORequest.interface";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient) {}

  getUser(response: AuthResponseInterface): UserInterface {
    return response.user;
  }

  getCurrentUser(): Observable<UserInterface> {
    const url = environment.apiUrl + "/user.json";
    return this.http.get<AuthResponseInterface>(url).pipe(map(this.getUser));
  }

  sso(data: HylandSSORequestInterface): Observable<UserInterface> {
    const url = environment.apiUrl + "/users/sso";
    return this.http
      .post<AuthResponseInterface>(url, data)
      .pipe(map(this.getUser));
  }
}
