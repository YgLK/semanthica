import { Injectable } from '@angular/core';
import {User} from "../../models/user";
import {Dish} from "../../models/dish";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User;

  constructor() {
    // create sample user
    this.user = new User(2, "user1", "password1", "admin", "John", "Doe",
      "johndoe@gmail.com", "+48777888999", "123 Maple Street, Any-town", []);
  }

  // addOrder(dishes: Map<Dish, number>) {
  //   this.user.addOrder(dishes);
  // }
}
