import { Injectable } from '@angular/core';
import {Item} from "../../models/item";

@Injectable({
  providedIn: 'root'
})
// cart service is a singleton
export class CartService {
  itemsCart: Map<Item, number>;

  constructor() {
    this.itemsCart = new Map<Item, number>();
  }

  addItemToCart(item: Item) {
    if (this.itemsCart.has(item)) {
      this.itemsCart.set(item, this.itemsCart.get(item)! + 1);
    } else {
      this.itemsCart.set(item, 1);
    }
  }

  removeItemFromCart(item: Item) {
    if(this.itemsCart.has(item)) {
      let newQuantity = this.itemsCart.get(item)! - 1;
      if(newQuantity > 0) {
        this.itemsCart.set(item, newQuantity);
      } else {
        this.itemsCart.delete(item);
      }
    }
  }
}
