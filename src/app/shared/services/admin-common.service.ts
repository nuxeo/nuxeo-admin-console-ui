import { EventEmitter, Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AdminCommonService {
  loadApp = new EventEmitter<Boolean>();
}
