import {Component} from '@angular/core';
import {Dish} from "../../models/dish";
import {CartService} from "../shared/cart.service";
import {UserService} from "../shared/user.service";
import {User} from "../../models/user";
import {OrderService} from "../shared/order.service";
import {Order} from "../../models/order";
import {DishService} from "../shared/dish.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent {
  user: User;
  title: string = 'Cart';
  dishesCart: Map<Dish, number>;
  isOrderPlaced: boolean = false;

  constructor(private cartService: CartService,
              private userService: UserService,
              private orderService: OrderService,
              private dishService: DishService) {
    this.dishesCart = cartService.dishesCart;
    this.user = userService.user;
  }

  addDishToCart(dish: Dish) {
    if (this.dishesCart.has(dish)) {
      this.dishesCart.set(dish, this.dishesCart.get(dish)! + 1);
    } else {
      this.dishesCart.set(dish, 1);
    }
    dish.maxAvailable -= 1;
  }

  removeDishFromCart(dish: Dish) {
    if(this.dishesCart.has(dish)) {
      let newQuantity = this.dishesCart.get(dish)! - 1;
      if(newQuantity > 0) {
        this.dishesCart.set(dish, newQuantity);
      } else {
        this.dishesCart.delete(dish);
      }
      dish.maxAvailable += 1;
    }
  }

  private precise_round(num: number, decimals: number) {
    let t = Math.pow(10, decimals);
    return (Math.round((num * t) + (decimals>0?1:0)*(Math.sign(num) * (10 / Math.pow(100, decimals)))) / t).toFixed(decimals);
  }

  calculateTotal() {
    let total: number = 0;
    for(let [dish, quantity] of this.dishesCart) {
      total += dish.price * quantity;
    }
    return Math.round(total * 100) / 100;
  }

  calculateTotalOfOrder(dishQuantityMap: Map<number, number>) {
    let total: number = 0;
    for(let [dishId, quantity] of dishQuantityMap) {
      total += this.dishService.getDishById(dishId).price * quantity;
    }
    return Math.round(total * 100) / 100;
  }

  orderSingleDish(dish: Dish) {
    if(this.dishesCart.has(dish)) {
      let singleDishOrder = new Map<number, number>();
      let quantity = this.dishesCart.get(dish)!;
      singleDishOrder.set(dish.id, quantity);
      this.user.addOrder(singleDishOrder, dish.price * quantity);

      // add order to the database
      // PS. id in Order constructor is redundant, mongodb will generate it automatically
      let order = new Order(999, this.user.id, new Date().toLocaleString(), singleDishOrder, this.calculateTotalOfOrder(singleDishOrder));
      // subtract ordered quantity from the dish's maxAvailable
      this.dishService.updateAvailability(dish.id, dish.maxAvailable);
      // save order in the database
      this.orderService.addOrder(order);

      this.isOrderPlaced = true;
      // remove the dish from the cart after placing the order
      this.dishesCart.delete(dish);
    } else {
      console.log("Cart is empty! Please add some dishes to your cart before placing the order.");
      this.isOrderPlaced = false;
    }
  }

  // order all dishes from the cart
  placeOrder() {
    if(this.dishesCart.size > 0) {
      // this.user.addOrder(this.getDishId_QuantityMap(), this.calculateTotal());
      this.isOrderPlaced = true;
      console.log(this.dishesCart);
      console.log(this.user.orderHistory);

      // add order to the database
      // PS. id in Order constructor is redundant, mongodb will generate it automatically
      let order = new Order( 999, this.user.id, new Date().toLocaleString(), this.getDishId_QuantityMap(), this.calculateTotal());
      // subtract ordered quantity from the dish's maxAvailable
      this.dishesCart.forEach(
        (count, dish) =>
          this.dishService.updateAvailability(dish.id, dish.maxAvailable)
      );
      // save order in the database
      this.orderService.addOrder(order);

      this.dishesCart.clear();
    } else {
      console.log("Cart is empty! Please add some dishes to your cart before placing the order.");
      this.isOrderPlaced = false;
    }
  }

  // get map: dishId -> quantity instead of dish -> quantity
  // in order to send it to the backend
  getDishId_QuantityMap(): Map<number, number>{
    let dishId_quantity = new Map<number, number>();
    this.dishesCart.forEach(
      (count, dish) => {
        dishId_quantity.set(dish.id, count);
      });
    return dishId_quantity;
  }

  clearCart() {
    this.dishesCart.forEach(
      (count, dish) => {
        dish.maxAvailable += count;
      });
    this.dishesCart.clear();
    this.isOrderPlaced = false;
  }
}
