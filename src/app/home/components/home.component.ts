import { Component } from "@angular/core";

@Component({
  selector: "admin-home",
  templateUrl: "./home.component.html",
})
export class HomeComponent {
  constructor() {}

  ngOnInit() {
    console.log("From Home !");
  }
}
