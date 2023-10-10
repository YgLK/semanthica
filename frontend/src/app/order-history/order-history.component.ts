import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user";
import {UserService} from "../shared/user.service";
import {DishService} from "../shared/dish.service";
import {Dish} from "../../models/dish";
import {Order} from "../../models/order";
import {OrderService} from "../shared/order.service";

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit{
  user: User;
  dishesList: Dish[];

  constructor(private userService: UserService,
              // dishService just for testing purposes
              public dishService: DishService,
              private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.user = this.userService.user;
    this.dishesList = this.dishService.dishesList;
  }

  getOrderHistory(): Order[] {
    //TODO: get only orders of the current user, when login is implemented
    return this.orderService.ordersList;
  }

  getOrderPositions(order: Order): Map<number, number> {
    return order.dishes;
  }
}
