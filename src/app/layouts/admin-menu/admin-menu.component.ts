import { Component } from "@angular/core";
import { ADMIN_MENU, AdminMenu } from "./admin-menu.constants";
@Component({
  selector: "admin-menu",
  templateUrl: "./admin-menu.component.html",
  styleUrls: ['./admin-menu.component.scss']
})
export class AdminMenuComponent {
  adminMenu: AdminMenu[] = ADMIN_MENU;
  menuItemSelected(id: number): void {
    this.adminMenu = this.adminMenu.map(menu => ({
      ...menu,
      isSelected: menu.id === id
    }));
  }
}