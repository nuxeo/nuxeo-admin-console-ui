import { UserInterface } from "../../shared/types/user.interface";

export interface AuthResponseInterface {
  user: UserInterface;
}

export interface AuthUserResponseInterface{
  id:string,
  properties:{
    firstName:string,
    lastName:string,
    email: string;
    username: string;
  },
  isAdministrator: boolean,
}
