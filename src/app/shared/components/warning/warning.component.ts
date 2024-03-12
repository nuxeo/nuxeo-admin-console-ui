import {CommonModule} from '@angular/common'
import {Component, Input} from '@angular/core'
import {Store} from '@ngrx/store'
import { AdminUserInterface } from '../../types/adminUser.interface'

@Component({
  selector: 'admin-warning',
  templateUrl: './warning.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class WarningComponent {
  @Input() 
  getCurrentUser: AdminUserInterface = {} as AdminUserInterface

  public currentUser:AdminUserInterface = {} as AdminUserInterface

  constructor() {}

  ngOnInit(): void {
    this.currentUser = this.getCurrentUser
  }
  
}
