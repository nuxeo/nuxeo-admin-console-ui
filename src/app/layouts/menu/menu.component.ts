import { Component } from "@angular/core";
import { ADMIN_MENU, Menu } from "./menu.constants";
@Component({
  selector: "menu",
  templateUrl: "./menu.component.html",
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  menu: Menu[] = ADMIN_MENU;
  menuItemSelected(id: number): void {
    this.menu = this.menu.map(menu => ({
      ...menu,
      isSelected: menu.id === id
    }));
  }
}