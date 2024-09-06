import {  PROBES_LABELS } from "../home/home.constants";
import { Component,  OnInit } from "@angular/core";
import {  Subscription } from "rxjs";

@Component({
  selector: "probes",
  templateUrl: "./probes.component.html",
  styleUrls: ["./probes.component.scss"],
})
export class ProbesComponent implements OnInit {
  PROBES_LABELS = PROBES_LABELS;
  fetchProbesSubscription = new Subscription();
  
  constructor(
   
  ) {
    
    console.log("probes data")
  }

  ngOnInit(): void {
   console.log("probes data");
  }
}
