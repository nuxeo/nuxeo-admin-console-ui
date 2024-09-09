import { PROBES_LABELS } from "../home/home.constants";
import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

@Component({
  selector: "probes",
  templateUrl: "./probes.component.html",
  styleUrls: ["./probes.component.scss"],
})
export class ProbesComponent {
  PROBES_LABELS = PROBES_LABELS;
  fetchProbesSubscription = new Subscription();
  
  // Add the PROBES property
  PROBES = [
    { name: "repositoryStatus", displayName: "Repository" },
    { name: "runtimeStatus", displayName: "Runtime" },
    { name: "elasticSearchStatus", displayName: "Elasticsearch" },
    { name: "streamStatus", displayName: "Stream" },
    { name: "ldapDirectories", displayName: "LDAP Directories" },
  ];
}
