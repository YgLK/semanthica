import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Order, OrderRecord} from "../../models/order";
import {Subject} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  ordersList: Order[] = [];
  ordersListSubject = new Subject<Order[]>();

  constructor(private http: HttpClient, private authService: AuthService) {
    if (authService.isLoggedIn()){
      this.getOrders(authService.currentUser$.getValue()?.id);
    }
  }

  getOrders(userId?: number) {
    /*
    * Get orders from db with order records and prepare them to show in the Order history
     */
    if (!userId) {
        console.log('No user id provided in order retrieval');
    }
    this.http.get<any>('/api/orders/history/' + userId)
        .subscribe((data: any) => {
          this.ordersList = data.map((order: any) => this.prepareOrder(order));
          this.ordersListSubject.next(this.ordersList);
        });
  }

  addOrder(order: Order) {
    /*
    * Add order to the database and to the ordersList
     */
    this.ordersList.push(order);
    this.http.post(
      '/api/orders-full',
      order.getOrderJson(),
      {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    ).subscribe(() => {
      console.log('order added');
    });
  }

  deleteOrder(id: number) {
    /*
    * Delete order from the database and from the ordersList
     */
    this.ordersList = this.ordersList.filter(order => order.id !== id);
    this.http.delete('/api/orders/' + id)
      .subscribe(() => {
        console.log('order deleted');
      });
  }

  prepareOrder(orderData: any): Order {
    /*
    * Prepare order from the data received from the backend to show in the Order history
     */
    let orderRecords: OrderRecord[] = [];
    orderData.order_records.forEach((order_record: any) => {
      orderRecords.push(new OrderRecord(order_record.item_id, order_record.quantity, order_record.item_name, order_record.item_price));
    })

    return new Order(
      orderData.user_id,
      orderData.created_at,
      orderData.status,
      orderRecords,
      orderData.total,
      orderData.id,
    );
  }
}
