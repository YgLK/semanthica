import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CartService} from "../shared/cart.service";
import {Item} from "../../models/item";
import {ItemService} from "../shared/item.service";

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit{
  item: Item = new Item();
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
  }

  removeItemFromCart(item: Item) {
    this.cartService.removeItemFromCart(item);
  }
}
