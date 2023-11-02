import {Component} from '@angular/core';
import {CartService} from "../shared/cart.service";
import {UserService} from "../shared/user.service";
import {User} from "../../models/user";
import {OrderService} from "../shared/order.service";
import {Order, OrderRecord, OrderStatus} from "../../models/order";
import {Item} from "../../models/item";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent {
  user: User;
  title: string = 'Cart';
  // itemsCart as a map: item -> quantity
  itemsCart: Map<Item, number>;
  isOrderPlaced: boolean = false;
  TEMP_CONST_USER_ID = 2;

  constructor(protected cartService: CartService,
              private userService: UserService,
              private orderService: OrderService,
      ) {
    this.itemsCart = cartService.itemsCart;
    this.user = userService.user;
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
    if(this.itemsCart.size > 0) {
      this.isOrderPlaced = true;
      let orderRecords: OrderRecord[] = [];
      this.itemsCart.forEach(
        (count, item) => {
          orderRecords.push(new OrderRecord(item.id, count));
        });
      // add order
      let order = new Order(this.TEMP_CONST_USER_ID, new Date().toLocaleString(), OrderStatus.CREATED, orderRecords, this.calculateTotal());
      // save order in the database
      this.orderService.addOrder(order);
      this.itemsCart.clear();
    } else {
      console.log("Cart is empty! Please add some dishes to your cart before placing the order.");
      this.isOrderPlaced = false;
    }
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
