import {Component, OnInit} from '@angular/core';
import {Filter} from "../models/filter";
import {Router} from "@angular/router";
import {CartService} from "./shared/cart.service";
import {Item} from "../models/item";
import {ItemService} from "./shared/item.service";
import {AuthService} from "./shared/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'semanthica';
  itemsList: Item[];
  itemsCart: Map<Item, number>;
  filter: Filter;

  constructor(private itemService: ItemService,
              public router: Router,
              private cartService: CartService,
              public authService: AuthService) {
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

  getAllSubcategories() {
    let subcategories = new Set<string>();
    this.itemsList.forEach(item => subcategories.add(item.subCategory));
    return Array.from(subcategories);
  }

  addItemToCart(item: Item) {
    this.cartService.addItemToCart(item);
  }

  removeItemFromCart(item: Item) {
    this.cartService.removeItemFromCart(item);
  }

  logout() {
    this.authService.logout();
    this.authService.setCurrentUser();
    this.router.navigate(['/login']);
  }
}
