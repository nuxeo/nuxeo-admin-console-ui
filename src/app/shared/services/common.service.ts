import { EventEmitter, Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  loadApp = new EventEmitter<Boolean>();
  reindexDialogClosed = new EventEmitter<Boolean>();
}
