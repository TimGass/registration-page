export class User {
  public id: string;
  public email: string;
  public username: string;
  public password: string;

  constructor(input : { id: string, email: string, username: string, password: string }) {
    this.id = input.id;
    this.email = input.email;
    this.username = input.username;
    this.password = input.password;
    return this;
  }
}
