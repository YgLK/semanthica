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

  isItemInCart(item: Item): Item | null {
    /**
     * Used to check if the item is already in the cart since frequently list
     * of items is refreshed and its references changes
     */
    for (let [cartItem, quantity] of this.itemsCart) {
      if (cartItem.id === item.id) {
        return cartItem;
      }
    }
    return null
  }

  addItemToCart(item: Item) {
    // check if item already in cart
    let cartItem = this.isItemInCart(item);
    if(cartItem != null) {
      // if no more items in stock, do nothing
      if(cartItem.stockQuantity < this.itemsCart.get(cartItem)! + 1) {
        return;
      }
      this.itemsCart.set(cartItem, this.itemsCart.get(cartItem)! + 1);
      // cartItem.stockQuantity -= 1;
    } else {
      this.itemsCart.set(item, 1);
      // item.stockQuantity -= 1;
    }
  }

  removeItemFromCart(item: Item) {
    // check if item already in cart
    let cartItem = this.isItemInCart(item);
    if(cartItem != null) {
      let newQuantity = this.itemsCart.get(cartItem)! - 1;
      if(newQuantity > 0) {
        this.itemsCart.set(cartItem, newQuantity);
      } else {
        this.itemsCart.delete(cartItem);
      }
      // cartItem.stockQuantity += 1;
    }
  }

  getItemCartQuantity(itemId: number): number {
    for(let [item, quantity] of this.itemsCart) {
      if(item.id === itemId) {
        return quantity;
      }
    }
    return 0;
  }
}
