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
