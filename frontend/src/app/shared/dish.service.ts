import {Injectable} from '@angular/core';
import {Dish} from "../../models/dish";
import {Review} from "../../models/review";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Item} from "../../models/item";


@Injectable()
export class DishService {
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
        data.forEach((dish: any) => {
          console.log(dish);
          itemsPrepared.push(this.prepareItem(dish));
        });
      });
    this.itemsList = itemsPrepared;
    console.log("items prepared");
    console.log(this.itemsList);
  }

  getItem(id: number): Item {
    return this.itemsList.find(item => item.id === id)!;
  }

  addItem(item: Item) {
    this.itemsList.push(item);
    this.http.post(
      '/api/dishes',
      item,
      {headers: new HttpHeaders( {'Content-Type': 'application/json'})}
    ).subscribe(() => {
      console.log('dish added');
    });
  }

  deleteItem(id: number) {
    this.itemsList = this.itemsList.filter(item => item.id !== id);
    this.http.delete('/api/items/' + id)
      .subscribe(() => {
        console.log('item deleted');
      });
  }

  // addReview(dishId: number, review: Review) {
  //   const dish = this.getDishById(dishId);
  //   dish.reviews.push(review);
  //   this.http.patch(
  //     '/api/dishes/' + dishId,
  //     // TODO: nickname instead of id
  //     {reviews: dish.reviews},
  //     {headers: new HttpHeaders( {'Content-Type': 'application/json'})}
  //   ).subscribe(() => {
  //     console.log('review added');
  //   });
  // }
  //
  // updateAvailability(dishId: number, newMaxAvailable: number) {
  //   this.http.patch(
  //     '/api/dishes/' + dishId,
  //     {maxAvailable: newMaxAvailable},
  //     {headers: new HttpHeaders( {'Content-Type': 'application/json'})}
  //   ).subscribe(() => {
  //     console.log('availability updated');
  //   });
  // }

   // TODO: refactor needed since now we've got separate record for each item
  // addRating(itemId: number, rating: number) {
  //   const item = this.getItemById(itemId);
  //   item.ratings.push(rating);
  //   this.http.patch(
  //     '/api/dishes/' + dishId,
  //     {ratings: dish.ratings},
  //     {headers: new HttpHeaders( {'Content-Type': 'application/json'})}
  //   ).subscribe(() => {
  //     console.log('rating added');
  //   });
  // }

  // prepareDish(dishData: any): Dish {
  //   return new Dish(
  //     dishData.id,
  //     dishData.name,
  //     dishData.ratings,
  //     dishData.reviews,
  //     dishData.cuisine,
  //     dishData.category,
  //     dishData.ingredients,
  //     dishData.maxAvailable,
  //     dishData.price,
  //     dishData.description,
  //     dishData.imageUrls
  //   );
  // }

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
  getItemByName(name: string) {
    return this.itemsList.find(item => item.name.toLowerCase() === name.toLowerCase());
  }

  getItemById(id: number): Item {
    return this.itemsList.find(item => item.id === id)!;
  }
}
