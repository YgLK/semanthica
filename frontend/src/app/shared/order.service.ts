import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Order, OrderRecord} from "../../models/order";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  ordersList: Order[] = [];
  ordersListSubject = new Subject<Order[]>();

  constructor(private http: HttpClient) {
    this.ordersList = [];
    this.getOrders();
  }

  // Method to subscribe to changes in the list
  onItemListChange() {
    return this.ordersListSubject.asObservable();
  }

  getOrders() {
    /*
    * Get orders from db with order records and prepare them to show in the Order history
     */
    this.http.get<any>('/api/orders-full')
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
    console.log(order.getOrderJson());
    // TODO
    // this.http.post(
    //   '/api/orders',
    //   order.getOrderJson(),
    //   {headers: new HttpHeaders( {'Content-Type': 'application/json'})}
    // ).subscribe(() => {
    //   console.log('order added');
    // });
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
      orderRecords.push(new OrderRecord(order_record.item_id, order_record.quantity));
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
