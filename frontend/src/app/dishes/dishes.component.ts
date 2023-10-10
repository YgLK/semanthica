import {Component, OnInit} from '@angular/core';
import {Dish} from '../../models/dish';
import {DishService} from "../shared/dish.service";
import {Router} from "@angular/router";
import {CartService} from "../shared/cart.service";
import {FilterService} from "../shared/filter.service";
import {Item} from "../../models/item";


@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css']
})
export class DishesComponent implements OnInit{
  title: string = 'Dishes';
  dishes: Item[];
  dishesCart: Map<Dish, number>;
  // dishes meeting the filter criteria
  filteredDishesList: Dish[] = [];
  filter: any;
  // pagination
  page:number = 1;
  itemsPerPage: number = 5;

  constructor(private dishService: DishService, private cartService: CartService, private filterService: FilterService,
              public router: Router) {
    this.dishesCart = cartService.dishesCart;
    this.filter = filterService.filter;
  }

  ngOnInit(): void {
    this.dishes = this.dishService.itemsList;
    // set init max, min prices
    this.filter.minPrice = this.getMinPrice();
    this.filter.maxPrice = this.getMaxPrice();
  }

  removeDishFromMenu(dishToDel: Dish) {
    console.log(dishToDel.name + ' removed from the menu');
    // remove from menu
    this.dishes = this.dishes.filter(dish => dish.name !== dishToDel.name);
    // remove from cart since it's no longer available
    if(this.dishesCart.has(dishToDel)) {
      this.dishesCart.delete(dishToDel);
    }
    // remove from database
    this.dishService.deleteItem(dishToDel.id);
  }

  addDishToCart(dish: Dish) {
    this.cartService.addDishToCart(dish);
    dish.maxAvailable -= 1;
  }

  removeDishFromCart(dish: Dish) {
    this.cartService.removeDishFromCart(dish);
    dish.maxAvailable += 1;
  }

  getMaxPrice() {
    return Math.max(...this.dishes.map(dish => dish.price));
  }

  getMinPrice() {
    return Math.min(...this.dishes.map(dish => dish.price));
  }

  getAllCategories() {
    let categories = new Set<string>();
    this.dishes.forEach(dish => categories.add(dish.category));
    return Array.from(categories);
  }

  getAllOfCuisines() {
    let cuisines = new Set<string>();
    this.dishes.forEach(dish => cuisines.add(dish.cuisine));
    return Array.from(cuisines);
  }
}
