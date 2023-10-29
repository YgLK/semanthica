import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user";
import {UserService} from "../shared/user.service";
import {Order, OrderRecord} from "../../models/order";
import {OrderService} from "../shared/order.service";
import {ItemService} from "../shared/item.service";

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit{
  user: User;
  orders: Order[] = [];

  constructor(private userService: UserService,
              private orderService: OrderService,
  ) {}

  ngOnInit(): void {
    this.user = this.userService.user;
  }

  getOrderHistory(): Order[] {
    return this.orderService.ordersList;
  }
}
