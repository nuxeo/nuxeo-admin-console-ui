import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ElasticSearchReindexService {
  private url = "/management/elasticsearch/";
  private geturl = '/checkSearch'
  private suburl = "/reindex";
  baseUrl = "/api";
  private readonly jsonFilePath = environment.apiUrl + "/reindex-info.json";
  constructor(private http: HttpClient) {}

  performReindex(DOC_ID: string): Observable<any> {
    
      return this.http.post<any>(
        `${this.baseUrl}${this.url}1866799d-dbda-4529-a249-a1742784dbad${this.suburl}`,
        {}
      );

    // return this.http.post<any>('http://localhost:8080/nuxeo/api/v1/management/elasticsearch/reindex',
    //   {}
    // );

   // return this.http.get<any>(this.jsonFilePath);
 // return this.http.get<any>(`${this.baseUrl}${this.url}${this.geturl}`);
  }
}
