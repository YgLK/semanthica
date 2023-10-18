import { Injectable } from '@angular/core';
import {Item} from "../../models/item";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Review} from "../../models/review";
import {BehaviorSubject, map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  itemsList: Item[] = [];
  itemsList$ = new BehaviorSubject<Item[]>(this.itemsList);

  // update the items list and notify subscribers
  updateItemsList(updatedItems: Item[]) {
    this.itemsList = updatedItems;
    this.itemsList$.next(this.itemsList);
  }

  constructor(private http: HttpClient) {
    this.itemsList = [];
    this.getItems();
  }

  getItems() {
    let itemsPrepared: Item[] = [];
    // console.log("get dishes and prepare them");
    this.http.get<any>('/api/items/?page=20&items_per_page=2') // TODO: limit items and pagination
      .subscribe((data: any) => {
        data.forEach((item: any) => {
          console.log(item);
          itemsPrepared.push(Item.createItem(item));
        });
      });
    this.itemsList = itemsPrepared;
    // console.log("items prepared");
    // console.log(this.itemsList);
  }

  getItemReviews(itemId: number): Review[] {
    // let dishesPrepared: Dish[] = [];
    let reviews: Review[] = [];
    this.http.get<any>(`/api/items/${itemId}/reviews`) // TODO: limit items and pagination
      .subscribe((data: any) => {
        data.forEach((review: any) => {
          // console.log(review);
          reviews.push(new Review(
            review.username,
            review.title,
            review.created_at,
            review.comment
          ));
        });
      });
    return reviews;
  }

  addReview(itemId: number, review: Review) {
    // TODO: use logged in user id, add rating to review
    const user_id = 2;
    const rating = 4;

    const body = {
        user_id: user_id,
        item_id: itemId,
        rating: rating,
        // title: review.title,
        comment: review.reviewContent
    }
    // console.log(body)
    this.http.post(
      '/api/reviews',
        body,
      {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    ).subscribe(() => {
      // console.log('review added');
    });
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

  filterItemById(id: number): Item {
    return this.itemsList.find(item => item.id === id)!;
  }

  getItemById(itemId: number): Observable<Item> {
    return this.http.get<any>('/api/items/' + itemId)
      .pipe(
        map((itemData: any) => {
          console.log(itemData);
          return Item.createItem(itemData);
        })
      );
  }
}
