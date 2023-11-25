import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user";
import {Order} from "../../models/order";
import {OrderService} from "../shared/order.service";

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit{
  user: User;
  orders: Order[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.ordersListSubject.subscribe((ordersList: Order[]) => {
      this.orders = ordersList;
    });
  }

  getOrderHistory(): Order[] {
    return this.orderService.ordersList;
  }
}
