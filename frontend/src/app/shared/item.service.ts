import { Injectable } from '@angular/core';
import {Item} from "../../models/item";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  itemsList: Item[];

  constructor(private http: HttpClient) {
    this.itemsList = [];
    this.getItems();
  }

  getItems() {
    // let dishesPrepared: Dish[] = [];
    let itemsPrepared: Item[] = [];
    console.log("get dishes and prepare them");
    this.http.get<any>('/api/items/?page=20&items_per_page=2') // TODO: limit items and pagination
      .subscribe((data: any) => {
        data.forEach((item: any) => {
          console.log(item);
          itemsPrepared.push(this.prepareItem(item));
        });
      });
    this.itemsList = itemsPrepared;
    console.log("items prepared");
    console.log(this.itemsList);
  }

  getItem(itemId: number): Item {
    return this.itemsList.find(item => item.id === itemId)!;
  }

  addItem(item: Item) {
    this.itemsList.push(item);
    this.http.post(
      '/api/items',
      item,
      {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    ).subscribe(() => {
      console.log('dish added');
    });
  }

  deleteItem(itemId: number) {
    this.itemsList = this.itemsList.filter(item => item.id !== itemId);
    this.http.delete('/api/items/' + itemId)
      .subscribe(() => {
        console.log('item deleted');
      });
  }

  updateAvailability(itemId: number, newMaxAvailable: number) {
      this.http.patch(
          '/api/items/' + itemId,
          {stockQuantity: newMaxAvailable},
          {headers: new HttpHeaders( {'Content-Type': 'application/json'})}
      ).subscribe(() => {
          console.log('availability updated');
      });
  }

  prepareItem(itemData: any): Item {
    return new Item(
      itemData.id,
      itemData.name,
      itemData.description,
      itemData.main_category,
      itemData.sub_category,
      itemData.stock_quantity,
      itemData.price,
      itemData.image_url
    );
  }

    // in the end the Dish will be retrieved by id from the database
    getDishByName(name: string) {
        return this.itemsList.find(item => item.name.toLowerCase() === name.toLowerCase());
    }

    getItemById(id: number): Item {
    return this.itemsList.find(item => item.id === id)!;
  }
}
