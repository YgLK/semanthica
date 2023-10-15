import {Component, OnInit} from '@angular/core';
import {Dish} from '../../models/dish';
import {DishService} from "../shared/dish.service";
import {Router} from "@angular/router";
import {CartService} from "../shared/cart.service";
import {FilterService} from "../shared/filter.service";
import {Item} from "../../models/item";
import {ItemService} from "../shared/item.service";


@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css']
})
export class DishesComponent implements OnInit{
  title: string = 'Items';
  items: Item[];
  itemsCart: Map<Item, number>;
  // dishes meeting the filter criteria
  filteredItemsList: Item[] = [];
  filter: any;
  // pagination
  page:number = 1;
  itemsPerPage: number = 5;

  constructor(private itemService: ItemService, private cartService: CartService, private filterService: FilterService,
              public router: Router) {
    this.itemsCart = cartService.itemsCart;
    this.filter = filterService.filter;
  }

  ngOnInit(): void {
    this.items = this.itemService.itemsList;
    // set init max, min prices
    this.filter.minPrice = this.getMinPrice();
    this.filter.maxPrice = this.getMaxPrice();
  }

  removeItemFromMenu(itemToDel: Item) {
    console.log(itemToDel.name + ' removed from the menu');
    // remove from menu
    this.items = this.items.filter(item => item.name !== itemToDel.name);
    // remove from cart since it's no longer available
    if(this.itemsCart.has(itemToDel)) {
      this.itemsCart.delete(itemToDel);
    }
    // remove from database
    this.itemService.deleteItem(itemToDel.id);
  }

  addDishToCart(item: Item) {
    this.cartService.addItemToCart(item);
    item.stockQuantity -= 1;
  }

  removeDishFromCart(item: Item) {
    this.cartService.removeItemFromCart(item);
    item.stockQuantity += 1;
  }

  getMaxPrice() {
    return Math.max(...this.items.map(item => item.price));
  }

  getMinPrice() {
    return Math.min(...this.items.map(item => item.price));
  }

  getAllCategories() {
    let categories = new Set<string>();
    this.items.forEach(item => categories.add(item.mainCategory));
    return Array.from(categories);
  }

  getAllOfCuisines() {
    let cuisines = new Set<string>();
    this.items.forEach(item => cuisines.add(item.subCategory));
    return Array.from(cuisines);
  }
}
