import {Component} from '@angular/core';
import {Dish} from "../../models/dish";
import {CartService} from "../shared/cart.service";
import {UserService} from "../shared/user.service";
import {User} from "../../models/user";
import {OrderService} from "../shared/order.service";
import {Order} from "../../models/order";
import {DishService} from "../shared/dish.service";
import {Item} from "../../models/item";
import {ItemService} from "../shared/item.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent {
  user: User;
  title: string = 'Cart';
  itemsCart: Map<Item, number>;
  isOrderPlaced: boolean = false;

  constructor(private cartService: CartService,
              private userService: UserService,
              private orderService: OrderService,
              private itemService: ItemService,
              // private dishService: DishService
      ) {
    this.itemsCart = cartService.itemsCart;
    this.user = userService.user;
  }

  addDishToCart(item: Item) {
    if (this.itemsCart.has(item)) {
      this.itemsCart.set(item, this.itemsCart.get(item)! + 1);
    } else {
      this.itemsCart.set(item, 1);
    }
    item.stockQuantity -= 1;
  }

  removeDishFromCart(item: Item) {
    if(this.itemsCart.has(item)) {
      let newQuantity = this.itemsCart.get(item)! - 1;
      if(newQuantity > 0) {
        this.itemsCart.set(item, newQuantity);
      } else {
        this.itemsCart.delete(item);
      }
      item.stockQuantity += 1;
    }
  }

  private precise_round(num: number, decimals: number) {
    let t = Math.pow(10, decimals);
    return (Math.round((num * t) + (decimals>0?1:0)*(Math.sign(num) * (10 / Math.pow(100, decimals)))) / t).toFixed(decimals);
  }

  calculateTotal() {
    let total: number = 0;
    for(let [item, quantity] of this.itemsCart) {
      total += item.price * quantity;
    }
    return Math.round(total * 100) / 100;
  }

  calculateTotalOfOrder(dishQuantityMap: Map<number, number>) {
    let total: number = 0;
    for(let [itemId, quantity] of dishQuantityMap) {
      total += this.itemService.getItemById(itemId).price * quantity;
    }
    return Math.round(total * 100) / 100;
  }

  orderSingleDish(item: Item) {
    if(this.itemsCart.has(item)) {
      let singleDishOrder = new Map<number, number>();
      let quantity = this.itemsCart.get(item)!;
      singleDishOrder.set(item.id, quantity);
      this.user.addOrder(singleDishOrder, item.price * quantity);

      // add order to the database
      // PS. id in Order constructor is redundant, mongodb will generate it automatically
      let order = new Order(999, this.user.id, new Date().toLocaleString(), singleDishOrder, this.calculateTotalOfOrder(singleDishOrder));
      // subtract ordered quantity from the dish's maxAvailable
      // TODO: UPDATE stockQuantity ! it should be lowered here instead of staying the same in the updateAvailability method
      //       check if it's not updated somewhere else
      // UPDATE: stockQuantity is updated already during the adding to the cart! :)
      this.itemService.updateAvailability(item.id, item.stockQuantity);
      // save order in the database
      this.orderService.addOrder(order);

      this.isOrderPlaced = true;
      // remove the dish from the cart after placing the order
      this.itemsCart.delete(item);
    } else {
      console.log("Cart is empty! Please add some dishes to your cart before placing the order.");
      this.isOrderPlaced = false;
    }
  }

  // order all dishes from the cart
  placeOrder() {
    if(this.itemsCart.size > 0) {
      // this.user.addOrder(this.getDishId_QuantityMap(), this.calculateTotal());
      this.isOrderPlaced = true;
      console.log(this.itemsCart);
      console.log(this.user.orderHistory);

      // add order to the database
      // PS. id in Order constructor is redundant, mongodb will generate it automatically
      let order = new Order( 999, this.user.id, new Date().toLocaleString(), this.getDishId_QuantityMap(), this.calculateTotal());
      // subtract ordered quantity from the dish's maxAvailable
      this.itemsCart.forEach(
        (count, item) =>
          this.itemService.updateAvailability(item.id, item.stockQuantity)
      );
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
  getDishId_QuantityMap(): Map<number, number>{
    let dishId_quantity = new Map<number, number>();
    this.itemsCart.forEach(
      (count, item) => {
        dishId_quantity.set(item.id, count);
      });
    return dishId_quantity;
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
