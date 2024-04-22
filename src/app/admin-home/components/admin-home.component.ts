import { Component } from "@angular/core";

@Component({
  selector: "admin-home",
  templateUrl: "./admin-home.component.html",
})
export class AdminHomeComponent {
  constructor() {}

  ngOnInit() {
    console.log("From Home !");
  }
}
