import { PROBES_LABELS } from "../sub-features/probes-data/probes-data.constants";
import { Component } from "@angular/core";
import { Subscription } from "rxjs";

@Component({
  selector: "probes",
  templateUrl: "./probes.component.html",
  styleUrls: ["./probes.component.scss"],
})
export class ProbesComponent {
  PROBES_LABELS = PROBES_LABELS;
  fetchProbesSubscription = new Subscription();
}
