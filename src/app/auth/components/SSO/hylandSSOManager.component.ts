import {CommonModule} from '@angular/common'
import {Component} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {RouterLink} from '@angular/router'
import {Store} from '@ngrx/store'
import {combineLatest} from 'rxjs'
import {BackendErrorMessages} from 'src/app/shared/components/backendErrorMessages/backendErrorMessages.component'
import {authActions} from '../../store/actions'
import {selectIsSubmitting, selectValidationErrors} from '../../store/reducers'
import {HylandSSORequestInterface} from '../../types/hylandSSORequest.interface'

@Component({
  selector: 'admin-ssomanager',
  templateUrl: './hylandSSOManager.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
    BackendErrorMessages,
  ],
})
export class HylandSSOManagerComponent {
  data$ = combineLatest({
    isSubmitting: this.store.select(selectIsSubmitting),
    backendErrors: this.store.select(selectValidationErrors),
  })

  constructor(private fb: FormBuilder, private store: Store) {}

  initSSO() {
    const request: HylandSSORequestInterface = {
      app: {appID: 'AdminPanel'},
    }
    this.store.dispatch(authActions.sso({request}))
  }

  ngOnInit() {
    console.log('Init SSO')
    this.initSSO()
  }
}
