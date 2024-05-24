import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { AdminUserInterface } from "../../shared/types/adminUser.interface";
import { AuthResponseInterface } from "../types/authResponse.interface";
import { HylandSSORequestInterface } from "../types/hylandSSORequest.interface";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient) {}

  getUser(response: AuthResponseInterface): AdminUserInterface {
    return response.user;
  }

  getCurrentUser(): Observable<AdminUserInterface> {
    const url = environment.apiUrl + "/user.json";
    return this.http.get<AuthResponseInterface>(url).pipe(map(this.getUser));
  }

  sso(data: HylandSSORequestInterface): Observable<AdminUserInterface> {
    const url = environment.apiUrl + "/users/sso";
    return this.http
      .post<AuthResponseInterface>(url, data)
      .pipe(map(this.getUser));
  }
}
