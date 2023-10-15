import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CartService} from "../shared/cart.service";
import {Item} from "../../models/item";
import {ItemService} from "../shared/item.service";

@Component({
  selector: 'app-dish-details',
  templateUrl: './dish-details.component.html',
  styleUrls: ['./dish-details.component.css']
})
export class DishDetailsComponent implements OnInit{
  item: Item;
  itemsCart: Map<Item, number>;
  // image for the slider
  imageObject: Array<object> = new Array<object>();

  constructor(private itemService: ItemService, private router: Router, private route: ActivatedRoute,
              public  cartService: CartService) {
    this.itemsCart = cartService.itemsCart;
    // force route reload whenever params change
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    // here id will be retrieved from the URL and passed to the service
    this.item = this.itemService.getItemById(
      Number(this.route.snapshot.params['id'])
    )!;
    this.item.imageUrls.forEach(
      (url: string) => {
        this.imageObject.push({image: url, thumbImage: url});
      }
    );
  }

  addItemToCart(item: Item) {
    this.cartService.addItemToCart(item);
    item.stockQuantity -= 1;
  }

  removeItemFromCart(item: Item) {
    this.cartService.removeItemFromCart(item);
    item.stockQuantity += 1;
  }
}
