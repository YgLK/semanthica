import { Injectable } from '@angular/core';
import {Role, User} from "../../models/user";
import {Dish} from "../../models/dish";
import {Address} from "../../models/address";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User;

  constructor() {
    // create sample user
    this.user = new User(1, "user1", "password1", Role.USER, "John", "Doe",
      "johndoe@gmail.com", "+48777888999",
      [new Address("123 Maple Street, Any-town", "Any-town", "12345", "USA")]);
  }

  // addOrder(dishes: Map<Dish, number>) {
  //   this.user.addOrder(dishes);
  // }
}
