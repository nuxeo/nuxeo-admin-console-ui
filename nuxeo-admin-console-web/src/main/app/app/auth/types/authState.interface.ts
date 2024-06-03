import { BackendErrorsInterface } from "../../shared/types/backendErrors.interface";
import { AdminUserInterface } from "../../shared/types/adminUser.interface";

export interface AuthStateInterface {
  isSubmitting: boolean;
  currentUser: AdminUserInterface | null | undefined;
  isLoading: boolean;
  validationErrors: BackendErrorsInterface | null;
}
