import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CartService} from "../shared/cart.service";
import {Item} from "../../models/item";
import {ItemService} from "../shared/item.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-dish-details',
  templateUrl: './dish-details.component.html',
  styleUrls: ['./dish-details.component.css']
})
export class DishDetailsComponent implements OnInit{
  item: Item = new Item();
  itemsCart: Map<Item, number>;
  // image for the slider
  imageObject: Array<object> = new Array<object>();
  private itemSub: Subscription;

  constructor(private itemService: ItemService, private router: Router, private route: ActivatedRoute,
              public  cartService: CartService) {
    this.itemsCart = cartService.itemsCart;
    // force route reload whenever params change
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    const itemId = Number(this.route.snapshot.params['id']);
    this.itemService.getItemById(itemId).subscribe(
      (foundItem: Item) => {
        this.item = foundItem;
        this.item.imageUrls.forEach((url: string) => {
          this.imageObject.push({ image: url, thumbImage: url });
        });
      },
      (error: any) => {
        console.log(error)
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
