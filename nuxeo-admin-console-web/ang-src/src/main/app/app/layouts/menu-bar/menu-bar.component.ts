import { Component } from "@angular/core";
import { ADMIN_MENU, Menu } from "./menu-bar.constants";
@Component({
  selector: "menu-bar",
  templateUrl: "./menu-bar.component.html",
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent {
  menu: Menu[] = ADMIN_MENU;
  menuItemSelected(id: number): void {
    this.menu = this.menu.map(item => ({
      ...item,
      isSelected: item.id === id
    }));
  }
}