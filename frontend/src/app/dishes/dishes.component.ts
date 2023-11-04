import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {CartService} from "../shared/cart.service";
import {FilterService} from "../shared/filter.service";
import {Item} from "../../models/item";
import {ItemService} from "../shared/item.service";
import {Subscription} from "rxjs";
import {Filter} from "../../models/filter";


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
  filter: Filter;
  // pagination
  page:number = 1;
  itemsPerPage: number = 5;
  private itemsListSubscription: Subscription;

  constructor(private itemService: ItemService, protected cartService: CartService, private filterService: FilterService,
              public router: Router) {
    this.itemsCart = cartService.itemsCart;
    this.filter = filterService.filter;
    this.itemService.getItems();
  }

  ngOnInit(): void {
    this.itemsListSubscription = this.itemService.itemsList$.subscribe(updatedItems => {
      this.items = updatedItems;
    });
    // set default items list
    this.items = this.itemService.itemsList;
  }

  ngOnDestroy() {
    if (this.itemsListSubscription) {
      this.itemsListSubscription.unsubscribe();
    }
  }

  removeItemFromDatabase(itemToDel: Item) {
    console.log(`Item "${itemToDel.name}" removed from platform (soft delete)`);
    // remove from menu
    this.items = this.items.filter(item => item.name !== itemToDel.name);
    // remove from cart since it's no longer available
    this.cartService.removeItemFromCart(itemToDel);
    // tag item as deleted
    this.itemService.softDeleteItem(itemToDel.id);
  }

  addItemToCart(item: Item) {
    this.cartService.addItemToCart(item);
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
}
