import {Component, OnInit} from '@angular/core';
import {DishService} from "../shared/dish.service";
import {Dish} from "../../models/dish";
import {ActivatedRoute, Router} from "@angular/router";
import {CartService} from "../shared/cart.service";

@Component({
  selector: 'app-dish-details',
  templateUrl: './dish-details.component.html',
  styleUrls: ['./dish-details.component.css']
})
export class DishDetailsComponent implements OnInit{
  dish: Dish;
  dishesCart: Map<Dish, number>;
  // image for the slider
  imageObject: Array<object> = new Array<object>();

  constructor(private dishService: DishService, private router: Router, private route: ActivatedRoute,
              public  cartService: CartService) {
    this.dishesCart = cartService.dishesCart;
    // force route reload whenever params change
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    // here id will be retrieved from the URL and passed to the service
    this.dish = this.dishService.getDishByName(
      this.route.snapshot.params['id']
    )!;
    this.dish.imageUrls.forEach(
      (url: string) => {
        this.imageObject.push({image: url, thumbImage: url});
      }
    );
  }

  addDishToCart(dish: Dish) {
    this.cartService.addDishToCart(dish);
    dish.maxAvailable -= 1;
  }

  removeDishFromCart(dish: Dish) {
    this.cartService.removeDishFromCart(dish);
    dish.maxAvailable += 1;
  }
}
