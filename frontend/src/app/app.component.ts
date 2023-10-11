import {Component, OnInit} from '@angular/core';
import {Dish} from "../models/dish";
import {DishService} from "./shared/dish.service";
import {Filter} from "../models/filter";
import {Router} from "@angular/router";
import {CartService} from "./shared/cart.service";
import {Item} from "../models/item";
import {ItemService} from "./shared/item.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'restaurant-app';
  itemsList: Item[];
  itemsCart: Map<Item, number>;
  filter: Filter;

  constructor(private itemService: ItemService, public router: Router, private cartService: CartService) {
    this.itemsCart = cartService.itemsCart;
  }

  ngOnInit() {
    // this.dishesList = this.dishService.dishesList;
    this.itemsList = this.itemService.itemsList;
    // initialize filter used for dishes filtering
    this.filter = new Filter();
  }

  getAllCategories() {
    let categories = new Set<string>();
    this.itemsList.forEach(item => categories.add(item.mainCategory));
    return Array.from(categories);
  }

  addItemToCart(item: Item) {
    this.cartService.addItemToCart(item);
  }

  removeItemFromCart(item: Item) {
    this.cartService.removeItemFromCart(item);
  }
}
