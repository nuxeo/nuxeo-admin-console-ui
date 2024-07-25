// reducers/menu.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { toggleMenu } from './action';

export interface MenuState {
  isOpen: boolean;
}

export const initialState: MenuState = {
  isOpen: false,
};

export const menuReducer = createReducer(
  initialState,
  on(toggleMenu, state => ({ isOpen: !state.isOpen }))
);
