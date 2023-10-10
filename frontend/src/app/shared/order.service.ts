import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Order} from "../../models/order";


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  ordersList: Order[];

  constructor(private http: HttpClient) {
    this.ordersList = [];
    this.getOrders();
  }

  getOrders() {
    let ordersPrepared: Order[] = [];
    this.http.get<any>('/api/orders')
      .subscribe((data: any) => {
        data.forEach((order: any) => {
          console.log(order);
          ordersPrepared.push(this.prepareOrder(order));
        });
      });
    this.ordersList = ordersPrepared;
  }

  getOrder(id: number): Order {
    return this.ordersList.find(order => order.id === id)!;
  }

  addOrder(order: Order) {
    this.ordersList.push(order);
    // order.dishes = Array.from(order.dishes.entries().forEach((entry: any) => {
    //   return {dishId: entry[0], quantity: entry[1]};
    // });
    console.log(order.getOrderJson());
    this.http.post(
      '/api/orders',
      order.getOrderJson(),
      {headers: new HttpHeaders( {'Content-Type': 'application/json'})}
    ).subscribe(() => {
      console.log('order added');
    });
  }

  deleteOrder(id: number) {
    this.ordersList = this.ordersList.filter(order => order.id !== id);
    this.http.delete('/api/orders/' + id)
      .subscribe(() => {
        console.log('order deleted');
      });
  }

  prepareOrder(orderData: any): Order {
    function getOrderEntries(dishes: any) {
      let orderEntries: Map<number, number> = new Map<number, number>();
      dishes.forEach((dish: any) => {
        orderEntries.set(dish.dishId, dish.quantity);
      });
      return orderEntries;
    }

    return new Order(
      orderData._id,
      orderData.user_id,
      orderData.date,
      getOrderEntries(orderData.dishes),
      orderData.total
    );
  }
}
