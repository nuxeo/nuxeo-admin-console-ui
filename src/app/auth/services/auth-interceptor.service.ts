import { PersistenceService } from "../../shared/services/persistence.service";
import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private persistenceService: PersistenceService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const req = request.clone({
      setHeaders: {
        //TODO: Remove this once proper authentication & login flow is implemented
        Authorization: "Basic " + btoa("Administrator:Administrator"),
      },
    });
    return next.handle(req);
  }
}