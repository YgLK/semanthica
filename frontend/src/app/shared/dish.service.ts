import {Injectable} from '@angular/core';
import {Dish} from "../../models/dish";
import {Review} from "../../models/review";
import {HttpClient, HttpHeaders} from "@angular/common/http";


@Injectable()
export class DishService {
  dishesList: Dish[];

  constructor(private http: HttpClient) {
    this.dishesList = [];
    this.getDishes();
  }

  getDishes() {
    let dishesPrepared: Dish[] = [];
    this.http.get<any>('/api/dishes')
      .subscribe((data: any) => {
        data.forEach((dish: any) => {
          console.log(dish);
          dishesPrepared.push(this.prepareDish(dish));
        });
      });
    this.dishesList = dishesPrepared;
  }

  getDish(id: number): Dish {
    return this.dishesList.find(dish => dish.id === id)!;
  }

  addDish(dish: Dish) {
    this.dishesList.push(dish);
    this.http.post(
      '/api/dishes',
      dish,
      {headers: new HttpHeaders( {'Content-Type': 'application/json'})}
    ).subscribe(() => {
      console.log('dish added');
    });
  }

  deleteDish(id: number) {
    this.dishesList = this.dishesList.filter(dish => dish.id !== id);
    this.http.delete('/api/dishes/' + id)
      .subscribe(() => {
        console.log('dish deleted');
      });
  }

  addReview(dishId: number, review: Review) {
    const dish = this.getDishById(dishId);
    dish.reviews.push(review);
    this.http.patch(
      '/api/dishes/' + dishId,
      // TODO: nickname instead of id
      {reviews: dish.reviews},
      {headers: new HttpHeaders( {'Content-Type': 'application/json'})}
    ).subscribe(() => {
      console.log('review added');
    });
  }

  updateAvailability(dishId: number, newMaxAvailable: number) {
    this.http.patch(
      '/api/dishes/' + dishId,
      {maxAvailable: newMaxAvailable},
      {headers: new HttpHeaders( {'Content-Type': 'application/json'})}
    ).subscribe(() => {
      console.log('availability updated');
    });
  }

  addRating(dishId: number, rating: number) {
    const dish = this.getDishById(dishId);
    dish.ratings.push(rating);
    this.http.patch(
      '/api/dishes/' + dishId,
      {ratings: dish.ratings},
      {headers: new HttpHeaders( {'Content-Type': 'application/json'})}
    ).subscribe(() => {
      console.log('rating added');
    });
  }

  prepareDish(dishData: any): Dish {
    return new Dish(
      dishData.id,
      dishData.name,
      dishData.ratings,
      dishData.reviews,
      dishData.cuisine,
      dishData.category,
      dishData.ingredients,
      dishData.maxAvailable,
      dishData.price,
      dishData.description,
      dishData.imageUrls
    );
  }

  // in the end the Dish will be retrieved by id from the database
  getDishByName(name: string) {
    return this.dishesList.find(dish => dish.name.toLowerCase() === name.toLowerCase());
  }

  getDishById(id: number): Dish {
    return this.dishesList.find(dish => dish.id === id)!;
  }
}
