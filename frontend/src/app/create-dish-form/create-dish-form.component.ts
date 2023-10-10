import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Dish} from "../../models/dish";
import {Filter} from "../../models/filter";
import {FilterService} from "../shared/filter.service";
import {DishService} from "../shared/dish.service";

@Component({
  selector: 'app-create-dish-form',
  templateUrl: './create-dish-form.component.html',
  styleUrls: ['./create-dish-form.component.css']
})
export class CreateDishFormComponent implements OnInit {
  dishesList: Dish[];
  // passed to update min/max price
  filter: Filter;
  cuisine: string[] = [
    'American', 'Asian', 'British', 'Caribbean', 'Central European',
    'Chinese', 'Eastern European', 'French', 'Indian', 'Italian',
    'Japanese', 'Kosher', 'Mediterranean', 'Mexican', 'Middle Eastern',
    'Nordic', 'South American', 'South East Asian', 'Spanish', 'Thai',
    'Vietnamese', 'Other'
  ];
  category: string[] = ['Appetizer', 'Main', 'Dessert', 'Beverage','Salad', 'Soup', 'Vegan', 'Vegetarian', 'Gluten Free'];
  dishProperties: string[] = [
    'name', 'cuisine', 'category', 'ingredients',
    'maxAvailable', 'price', 'description', 'imageUrl'
  ];
  // default selected values
  cuisineSelect = this.cuisine[0];
  categorySelect = this.category[1];
  //if all fields are filled correctly, changes submit button from disabled to enabled and vice versa
  fieldsCorrect: boolean = false;
  // form group
  dishForm!: FormGroup;
  // used to show prompt when new dish is added
  isSubmitted: boolean;

  constructor(private filterService: FilterService, private dishService: DishService) {
    this.filter = filterService.filter;
    this.dishesList = dishService.dishesList;
  }

  ngOnInit(): void {
    let name = new FormControl(null, Validators.required);
    let cuisine = new FormControl(null, Validators.required);
    let category = new FormControl(null, Validators.required);
    let ingredients = new FormControl(null, Validators.required);
    let maxAvailable = new FormControl(null, Validators.required);
    let price = new FormControl(null, Validators.required);
    let description = new FormControl(null, Validators.required);
    let imageUrls = new FormControl(null, Validators.required);
    this.dishForm = new FormGroup({
      name: name,
      cuisine: cuisine,
      category: category,
      ingredients: ingredients,
      maxAvailable: maxAvailable,
      price: price,
      description: description,
      imageUrls: imageUrls
    });
  }

  inputValid() {
    // check if all fields are valid
    return this.dishForm.valid;
  }

  addNewDish(formValues: any) {
    if (this.dishForm.valid){
      let ingredients = formValues.ingredients.split(',').map((ingredient: string) => ingredient.trim());
      let imageUrls = formValues.imageUrls.split(',').map((imageUrl: string) => imageUrl.trim());
      let newDish = new Dish(this.getConsecutiveId(), formValues.name, [], [], formValues.cuisine, formValues.category,
        ingredients, formValues.maxAvailable, formValues.price, formValues.description, imageUrls)
      // add new dish to the mongoDB and dish list
      this.dishService.addDish(newDish);
      // update min/max price in filter
      this.filter.minPrice = Math.min(this.filter.minPrice, formValues.price);
      this.filter.maxPrice = Math.max(this.filter.maxPrice, formValues.price);
      // show prompt when new dish is added
      this.isSubmitted = true;
      // reset form
      this.dishForm.reset();
      // set default selected values
      this.dishForm.controls['cuisine'].setValue(this.cuisine[0]);
      this.dishForm.controls['category'].setValue(this.category[1]);
    } else {
      console.log('Something went wrong. Please check your input.');
    }
  }

  validateDishName() {
    return this.dishForm.controls['name'].valid || this.dishForm.controls['name'].untouched;
  }

  validateIngredients() {
    return this.dishForm.controls['ingredients'].valid || this.dishForm.controls['ingredients'].untouched;
  }

  validateMaxAvailable() {
    return this.dishForm.controls['maxAvailable'].valid || this.dishForm.controls['maxAvailable'].untouched;
  }

  validatePrice() {
    return this.dishForm.controls['price'].valid || this.dishForm.controls['price'].untouched;
  }

  validateDescription() {
    return this.dishForm.controls['description'].valid || this.dishForm.controls['description'].untouched;
  }

  validateImageUrls() {
    return this.dishForm.controls['imageUrls'].valid || this.dishForm.controls['imageUrls'].untouched;
  }

  getConsecutiveId() {
    let id = 1;
    while (this.dishesList.find(dish => dish.id === id) !== undefined) {
      id++;
    }
    return id;
  }
}
