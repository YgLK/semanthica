import {Injectable} from '@angular/core';
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

  constructor(private http: HttpClient) {
    this.itemsList = [];
  }

  // update the items list and notify subscribers
  updateItemsList(updatedItems: Item[]) {
    this.itemsList = updatedItems;
    this.itemsList$.next(this.itemsList);
  }

  getItems() {
    let itemsPrepared: Item[] = [];
    this.http.get<any>('/api/items/?page=2&items_per_page=100') // TODO: limit items and pagination
      .subscribe((data: any) => {
        data.forEach((item: any) => {
          itemsPrepared.push(Item.createItem(item));
        });
      });
    this.itemsList = itemsPrepared;
  }

  getItemReviews(itemId: number): Review[] {
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
        user_id: review.user_id,
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

  softDeleteItem(itemId: number) {
      this.http.put(
          `/api/items/${itemId}`,
          {
            is_deleted: true
          },
          {headers: new HttpHeaders({'Content-Type': 'application/json'})}
      ).subscribe(() => {
          console.log('item soft deleted');
      });
  }

  getItemById(itemId: number): Observable<Item> {
    return this.http.get<any>(`/api/items/${itemId}`)
      .pipe(
        map((itemData: any) => {
          console.log(itemData);
          return Item.createItem(itemData);
        })
      );
  }
}
