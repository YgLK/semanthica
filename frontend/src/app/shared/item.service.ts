import { Injectable } from '@angular/core';
import {Item} from "../../models/item";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Review} from "../../models/review";
import {BehaviorSubject, map, Observable} from "rxjs";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  itemsList: Item[] = [];
  itemsList$ = new BehaviorSubject<Item[]>(this.itemsList);

  constructor(private http: HttpClient, private userService : UserService) {
    this.itemsList = [];
  }

  // update the items list and notify subscribers
  updateItemsList(updatedItems: Item[]) {
    this.itemsList = updatedItems;
    this.itemsList$.next(this.itemsList);
  }

  getItems() {
    let itemsPrepared: Item[] = [];
    this.http.get<any>('/api/items/?page=20&items_per_page=2') // TODO: limit items and pagination
      .subscribe((data: any) => {
        data.forEach((item: any) => {
          console.log(item);
          itemsPrepared.push(Item.createItem(item));
        });
      });
    this.itemsList = itemsPrepared;
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
    // TODO: add rating to review
    const rating = 4;

    const body = {
        user_id: this.userService.user.id,
        item_id: itemId,
        rating: rating,
        title: review.title,
        comment: review.reviewContent
    }
    // console.log(body)
    this.http.post(
      '/api/reviews',
        body,
      {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    ).subscribe(() => {
      console.log('review added');
    });
  }

  addItem(item: Item) {
    this.itemsList.push(item);
    this.http.post(
      '/api/items',
      item.toJSON(),
      {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    ).subscribe(() => {
      console.log('dish added');
    });
  }

  deleteItem(itemId: number) {
    // TODO: Remove item from db by switching switching some flag telling if the item is available or deleted
    //      Its just SOFT DELETE, hard delete can be done only manually by admin in the db
      return
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
