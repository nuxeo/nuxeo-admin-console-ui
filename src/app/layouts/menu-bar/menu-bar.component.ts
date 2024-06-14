import { Component } from "@angular/core";
import { ADMIN_MENU, Menu } from "./menu-bar.constants";
import { IsActiveMatchOptions } from "@angular/router";
@Component({
  selector: "menu-bar",
  templateUrl: "./menu-bar.component.html",
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent {
  menu: Menu[] = ADMIN_MENU;
  readonly myMatchOptions: IsActiveMatchOptions = {
    queryParams: 'ignored',
    matrixParams: 'exact',
    paths: 'subset',
    fragment: 'exact',
  };
  menuItemSelected(id: number): void {
    this.menu = this.menu.map(item => ({
      ...item,
      isSelected: item.id === id
    }));
  }
}