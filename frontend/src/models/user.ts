import {Address} from "./address";

export enum Role {
  USER = "user",
  MODERATOR = "moderator",
  ADMIN = "admin"
}

export class User {
  constructor(
    public id: number = -1,
    public username: string = "",
    public password: string = "",
    public role: Role = Role.USER,
    public firstName: string = "",
    public lastName: string = "",
    public email: string = "",
    public phone: string = "",
    public addresses: Address[],
  ){}

  toJSON() {
    return {
      username: this.username,
      password: this.password,
      role: this.role,
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      phone_number: this.phone,
      addresses: this.addresses.map(address => address.toJSON())
    };
  }

  static fromJSON(userJSON: any): User {
    return new User(
      userJSON.id,
      userJSON.username,
      userJSON.password,
      userJSON.role,
      userJSON.first_name,
      userJSON.last_name,
      userJSON.email,
      userJSON.phone_number,
      userJSON.addresses.map((address: any) => Address.fromJSON(address))
    );
  }
}
