import {Component, Input} from '@angular/core';
import {Dish} from "../../models/dish";
import {FormControl} from "@angular/forms";
import {DishService} from "../shared/dish.service";

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent {
  @Input() dish: Dish;
  rating: number;
  ratingControl = new FormControl(0);
  // flag to show inform if user has already rated the dish
  hasRated: boolean = false;

  constructor(private dishService: DishService) {}

  addRating() {
    if(this.hasRated){
      return;
    }
    //add rating to database
    this.dishService.addRating(this.dish.id, this.ratingControl.value!);
    this.hasRated = true;
    console.log(this.ratingControl.value);
  }
}
