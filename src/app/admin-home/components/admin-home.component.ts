import { Component, OnInit } from "@angular/core";

@Component({
  selector: "admin-home",
  templateUrl: "./admin-home.component.html",
})
export class AdminHomeComponent implements OnInit {
  ngOnInit() {
    console.log("admin-home works!");
  }
}
