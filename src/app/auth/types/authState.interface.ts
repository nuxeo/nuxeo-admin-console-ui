import {BackendErrorsInterface} from 'src/app/shared/types/backendErrors.interface'
import {AdminUserInterface} from 'src/app/shared/types/adminUser.interface'

export interface AuthStateInterface {
  isSubmitting: boolean
  currentUser: AdminUserInterface | null | undefined
  isLoading: boolean
  validationErrors: BackendErrorsInterface | null
}
