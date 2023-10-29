import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user";
import {UserService} from "../shared/user.service";
import {Order, OrderRecord} from "../../models/order";
import {OrderService} from "../shared/order.service";
import {ItemService} from "../shared/item.service";
import {Item} from "../../models/item";

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit{
  user: User;
  orders: Order[];
  // for showing the items in the order history
  orderedItems: Item[] = [];

  constructor(private userService: UserService,
              public itemService: ItemService,
              private orderService: OrderService,
  ) {}

  ngOnInit(): void {
    this.user = this.userService.user;
    this.orderedItems = [];
    this.orderService.onItemListChange().subscribe((orders) => {
      if (orders.length > 0) {
        // Call your method here
        this.getItemsFromOrders();
      }
    });
  }

  getItemsFromOrders() {
    console.log(this.orderService.ordersList)
    this.orderService.ordersList.forEach((order: Order) => {
        order.orderRecords.forEach((orderRecord: OrderRecord) => {
          this.itemService.getItemById(orderRecord.item_id).subscribe(
              (foundItem: Item) => {
                console.log(foundItem)
                this.orderedItems.push(foundItem);
              },
              (error: any) => {
                console.log(error)
              }
          );
        });
    });
  }

  filterOrderedItemsById(itemId: number): Item {
    return this.orderedItems.filter(item => item.id === itemId)[0];
  }

  getOrderHistory(): Order[] {
    //TODO: get only orders of the current user, when login is implemented
    return this.orderService.ordersList;
  }
}
