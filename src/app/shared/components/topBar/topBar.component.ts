import {CommonModule} from '@angular/common'
import {Component} from '@angular/core'
import {RouterLink} from '@angular/router'
import {Store} from '@ngrx/store'
import {combineLatest} from 'rxjs'
import {selectCurrentUser} from 'src/app/auth/store/reducers'
import { WarningComponent } from '../warning/warning.component'

@Component({
  selector: 'admin-topbar',
  templateUrl: './topBar.component.html',
  standalone: true,
  imports: [RouterLink, CommonModule, WarningComponent],
})
export class TopBarComponent {
  data$ = combineLatest({
    currentUser: this.store.select(selectCurrentUser),
  })
  constructor(private store: Store) {}
}
