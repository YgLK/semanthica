import { Pipe, PipeTransform } from '@angular/core';
import {Dish} from "../../models/dish";
import {Filter} from "../../models/filter";

@Pipe({
  name: 'filterPipe',
  pure: false
})
export class FilterPipe implements PipeTransform {
  transform(dishes: Dish[], filter: Filter): Dish[] {
    // console.log('filter: ' + filter);
    let filtered = this.filterByName(dishes, filter.filterText);
    filtered = this.filterByPrice(filtered, filter.minPrice, filter.maxPrice)
    filtered = this.filterByRating(filtered, filter.minRating);
    filtered = this.filterByCuisine(filtered, filter.filterCuisines);
    filtered = this.filterByCategory(filtered, filter.filterCategories);
    return filtered;
  }

  filterByName(dishes: Dish[], searchText: string): Dish[] {
    // console.log('searchText: ' + searchText);
    if (!dishes)
      return [];
    if (!searchText)
      return dishes;
    searchText = searchText.toLowerCase();
    return dishes.filter(dish => {
      return dish.name.toLowerCase().includes(searchText);
    });
  }

  filterByPrice(dishes: Dish[], minPrice: number, maxPrice:number): Dish[] {
    if (minPrice > maxPrice) {
      console.log('PRICE FILTER ERROR: minPrice > maxPrice');
      return dishes;
    }
    return dishes.filter(dish => {
      return dish.price >= minPrice && dish.price <= maxPrice;
    });
  }

  filterByRating(dishes: Dish[], minRating: number): Dish[] {
    // console.log('minRating: ' + minRating);
    if(minRating < 0 || minRating > 5) {
      console.log('RATING FILTER ERROR: minRating < 0 || minRating > 5');
      return dishes;
    }
    return dishes.filter(dish => {
      return dish.getAvgRating() >= minRating || dish.getAvgRating() === -1;
    });
  }

  filterByCuisine(dishes: Dish[], cuisines: string[]): Dish[] {
    if(cuisines.length === 0) {
      return dishes;
    }
    return dishes.filter(dish => {
      return cuisines.includes(dish.cuisine);
    });
  }

  filterByCategory(dishes: Dish[], categories: string[]): Dish[] {
    if(categories.length === 0) {
      return dishes;
    }
    return dishes.filter(dish => {
      return categories.includes(dish.category);
    });
  }
}
