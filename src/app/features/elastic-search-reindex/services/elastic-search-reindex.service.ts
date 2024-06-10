import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ElasticSearchReindexService {
  private url = "/management/elasticsearch/";
  // private geturl = "checkSearch";
  private suburl = "/reindex";
  baseUrl = "/api";
  // private readonly jsonFilePath = environment.apiUrl + "/reindex-info.json";
  pageTitle: BehaviorSubject<string> = new BehaviorSubject("");
  constructor(private http: HttpClient) {}

  performReindex(DOC_ID: string): Observable<any> {
    // const id = '1866799d-dbda-4529-a249-a1742784dbad';
    return this.http.post<any>(
      `${this.baseUrl}${this.url}${DOC_ID}${this.suburl}`,
      {}
    );

    // return this.http.get<any>(this.jsonFilePath);
    // return this.http.get<any>(`${this.baseUrl}${this.url}${this.geturl}`); // GET call working
  }
}
