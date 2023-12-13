import {Component, Input, OnInit} from '@angular/core';
import {Review} from "../../models/review";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Item} from "../../models/item";
import {ItemService} from "../shared/item.service";
import {UserService} from "../shared/user.service";

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit{
  @Input() item: Item;
  reviews: Review[];
  // form
  reviewForm!: FormGroup;
  //if all fields are filled correctly, changes submit button from disabled to enabled and vice versa
  fieldsCorrect: boolean = false;
  isSubmitted:boolean = false;

  constructor(private itemService: ItemService, private userService: UserService) {}

  ngOnInit(): void {
    //  get reviews from dish
    this.reviews = this.itemService.getItemReviews(this.item.id);
    // create form group for new review
    let title = new FormControl(null, Validators.required);
    let date = new FormControl();
    let reviewContent = new FormControl(null,
      Validators.compose([Validators.required, Validators.minLength(50), Validators.maxLength(500)]));
    this.reviewForm = new FormGroup({
      title: title,
      reviewContent: reviewContent,
      date: date
    });
  }

  inputValid() {
    return this.reviewForm.valid;
  }

  addNewReview(formValues: any) {
    if (this.reviewForm.valid){
      let newReview = new Review(this.userService.user.id, formValues.title, formValues.date, formValues.reviewContent);
      // add review to database
      this.itemService.addReview(this.item.id, newReview);
      this.isSubmitted = true;
      this.reviewForm.reset();
      this.reviews.push(newReview);
    } else {
      console.log('invalid input');
    }
  }

  validateTitle() {
    return this.reviewForm.controls['title'].valid || this.reviewForm.controls['title'].untouched;
  }

  validateReviewContent() {
    return this.reviewForm.controls['reviewContent'].valid || this.reviewForm.controls['reviewContent'].untouched;
  }
}
