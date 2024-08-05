import { BackendErrorsInterface } from "../../shared/types/backendErrors.interface";
import { UserInterface } from "../../shared/types/user.interface";

export interface AuthStateInterface {
  isSubmitting: boolean;
  currentUser: UserInterface | null | undefined;
  isLoading: boolean;
  validationErrors: BackendErrorsInterface | null;
}
