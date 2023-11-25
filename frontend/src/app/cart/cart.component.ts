import {Component} from '@angular/core';
import {CartService} from "../shared/cart.service";
import {OrderService} from "../shared/order.service";
import {Order, OrderRecord, OrderStatus} from "../../models/order";
import {Item} from "../../models/item";
import {AuthService} from "../shared/auth.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent {
  title: string = 'Cart';
  // itemsCart as a map: item -> quantity
  itemsCart: Map<Item, number>;
  isOrderPlaced: boolean = false;

  constructor(protected cartService: CartService,
              private orderService: OrderService,
              private authService: AuthService
      ) {
    this.itemsCart = cartService.itemsCart;
  }

  calculateTotal() {
    let total: number = 0;
    for(let [item, quantity] of this.itemsCart) {
      total += item.price * quantity;
    }
    return Math.round(total * 100) / 100;
  }

  placeOrder() {
    /*
     Place order for all dishes in the cart and put it in the db.
     */
    // user must be logged in
    if (!(this.authService.isLoggedIn() && this.authService.currentUser$.getValue())) {
      console.log("Please log in to place an order.");
      return;
    }

    // cart must not be empty
    if (this.itemsCart.size === 0) {
      console.log("Cart is empty! Please add some dishes to your cart before placing the order.");
      return;
    }

    const user_id: number = this.authService.currentUser$.getValue()!.id;
    // update stock quantity
    let orderRecords: OrderRecord[] = [];
    this.itemsCart.forEach(
      (count, item) => {
        orderRecords.push(new OrderRecord(item.id, count));
      });
    // add order
    let order = new Order(user_id, new Date().toLocaleString(), OrderStatus.CREATED, orderRecords, this.calculateTotal());
    // save order in the database
    this.orderService.addOrder(order);
    this.itemsCart.clear();
    this.isOrderPlaced = true
  }

  // get map: dishId -> quantity instead of dish -> quantity
  // in order to send it to the backend
  getItemIdQuantityMap(): Map<number, number>{
    let orderRecord = new Map<number, number>();
    this.itemsCart.forEach(
      (count, item) => {
        orderRecord.set(item.id, count);
      });
    return orderRecord;
  }

  clearCart() {
    this.itemsCart.forEach(
      (count, item) => {
        item.stockQuantity += count;
      });
    this.itemsCart.clear();
    this.isOrderPlaced = false;
  }
}
