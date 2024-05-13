import { Component } from "@angular/core";
import { NAV_ITEMS, NavItem } from "./admin-menu.constants";
@Component({
  selector: "admin-menu",
  templateUrl: "./admin-menu.component.html",
  styleUrls: ['./admin-menu.component.scss']
})
export class AdminMenuComponent {
  constructor() { }
  navItems: NavItem[] = NAV_ITEMS;
  onClickSelectItem(id: number): void {
    this.navItems = this.navItems.map(item => ({
      ...item,
      isSelected: item.id === id
    }));
    const selectedItem = this.navItems.find(item => item.id === id);
  }
}