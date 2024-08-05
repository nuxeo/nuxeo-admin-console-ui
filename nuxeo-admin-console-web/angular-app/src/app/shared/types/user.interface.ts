export interface UserInterface {
  id: string,
  properties: {
    firstName: string,
    lastName: string,
    email: string;
    username: string;
  }
  isAdministrator: boolean,
}