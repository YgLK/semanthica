import { Injectable } from '@angular/core';
import {Dish} from "../../models/dish";

@Injectable({
  providedIn: 'root'
})
// cart service is a singleton
export class CartService {
  dishesCart: Map<Dish, number>;

  constructor() {
    this.dishesCart = new Map<Dish, number>();
  }

  addDishToCart(dish: Dish) {
    if (this.dishesCart.has(dish)) {
      this.dishesCart.set(dish, this.dishesCart.get(dish)! + 1);
    } else {
      this.dishesCart.set(dish, 1);
    }
  }

  removeDishFromCart(dish: Dish) {
    if(this.dishesCart.has(dish)) {
      let newQuantity = this.dishesCart.get(dish)! - 1;
      if(newQuantity > 0) {
        this.dishesCart.set(dish, newQuantity);
      } else {
        this.dishesCart.delete(dish);
      }
    }
  }
}
