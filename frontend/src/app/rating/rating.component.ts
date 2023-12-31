import {Component, Input} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent {
  // @Input() item: Item;
  rating: number;
  ratingControl = new FormControl(0);
  // flag to show inform if user has already rated the item
  hasRated: boolean = false;

  // constructor(private itemService: ItemService) {}

  addRating() {
    if(this.hasRated){
      return;
    }
    //add rating to database
    // this.itemService.addRating(this.item.id, this.ratingControl.value!);
    this.hasRated = true;
    console.log(this.ratingControl.value);
  }
}
