import { PROBES, PROBES_LABELS } from "./../../home.constants";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { Store, select } from "@ngrx/store";
import { HomeState, ProbesInfo } from "../../store/reducers";
import * as HomeActions from "../../store/actions";
import { HomeService } from "../../services/home.service";
@Component({
  selector: "probes-summary",
  templateUrl: "./probes-summary.component.html",
  styleUrls: ["./probes-summary.component.scss"],
})
export class ProbesSummaryComponent{
  
 

  
}

 