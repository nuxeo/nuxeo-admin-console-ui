import { routerNavigationAction } from "@ngrx/router-store";
import { createFeature, createReducer, on } from "@ngrx/store";
import { AuthStateInterface } from "../types/authState.interface";
import { authActions } from "./actions";

const initialState: AuthStateInterface = {
  isSubmitting: false,
  isLoading: false,
  currentUser: undefined,
  validationErrors: null,
};

const authFeature = createFeature({
  name: "auth",
  reducer: createReducer(
    initialState,
    on(authActions.sso, (state) => ({
      ...state,
      isSubmitting: true,
      validationErrors: null,
    })),
    on(authActions.ssoSuccess, (state, action) => ({
      ...state,
      isSubmitting: false,
      currentUser: action.currentUser,
    })),
    on(authActions.ssoFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      validationErrors: action.errors,
    })),
    on(authActions.getCurrentUser, (state) => ({
      ...state,
      isLoading: true,
    }
    )),
    on(authActions.getCurrentUserSuccess, (state, action) => ({
      ...state,
      isLoading: false,
      currentUser: action.currentUser,
    })),
    on(authActions.getCurrentUserFailure, (state) => ({
      ...state,
      isLoading: false,
      currentUser: null,
    })),
    on(routerNavigationAction, (state) => ({
      ...state,
      validationErrors: null,
    })),
    on(authActions.signOutSuccess, (state) => ({
      ...state,
      currentUser: null,
    })),
    on(authActions.signOutFailure, (state, { errors }) => ({
      ...state,
      errors,
    }))
  ),
});

export const {
  name: authFeatureKey,
  reducer: authReducer,
  selectIsSubmitting,
  selectIsLoading,
  selectCurrentUser,
  selectValidationErrors,
} = authFeature;
