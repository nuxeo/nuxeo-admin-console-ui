import { Component, OnInit } from "@angular/core";

@Component({
  selector: "admin-home",
  templateUrl: "./admin-home.component.html",
  styleUrls: ["./admin-home.component.scss"],
})
export class AdminHomeComponent implements OnInit {
  sample: Boolean = false;
  ngOnInit() {
    this.sample = true;
  }
}
