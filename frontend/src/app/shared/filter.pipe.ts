import { Pipe, PipeTransform } from '@angular/core';
import {Dish} from "../../models/dish";
import {Filter} from "../../models/filter";
import {Item} from "../../models/item";

@Pipe({
  name: 'filterPipe',
  pure: false
})
export class FilterPipe implements PipeTransform {
  transform(items: Item[], filter: Filter): Item[] {
    // console.log('filter: ' + filter);
    let filtered = this.filterByName(items, filter.filterText);
    filtered = this.filterByPrice(filtered, filter.minPrice, filter.maxPrice)
    filtered = this.filterByRating(filtered, filter.minRating);
    filtered = this.filterByCategory(filtered, filter.filterCategories);
    // filtered = this.filterBySubcategory(filtered, filter.filterCuisines);
    return filtered;
  }

  filterByName(items: Item[], searchText: string): Item[] {
    // console.log('searchText: ' + searchText);
    if (!items)
      return [];
    if (!searchText)
      return items;
    searchText = searchText.toLowerCase();
    return items.filter(item => {
      return item.name.toLowerCase().includes(searchText);
    });
  }

  filterByPrice(items: Item[], minPrice: number, maxPrice:number): Item[] {
    if (minPrice > maxPrice) {
      console.log('PRICE FILTER ERROR: minPrice > maxPrice');
      return items;
    }
    return items.filter(item => {
      return item.price >= minPrice && item.price <= maxPrice;
    });
  }

  // TODO: fix the filtering based on the rating of items
  //    (or just create sort by rating)
  filterByRating(items: Item[], minRating: number): Item[] {
    // // console.log('minRating: ' + minRating);
    // if(minRating < 0 || minRating > 5) {
    //   console.log('RATING FILTER ERROR: minRating < 0 || minRating > 5');
    //   return items;
    // }
    // return items.filter(item => {
    //   return item.getAvgRating() >= minRating || item.getAvgRating() === -1;
    // });
    return items;
  }

  filterByCategory(items: Item[], categories: string[]): Item[] {
    if(categories.length === 0) {
      return items;
    }
    return items.filter(item => {
      return categories.includes(item.mainCategory);
    });
  }

  // TODO: fix filtering by subcategory
  filterBySubcategory(items: Item[], subcategories: string[]): Item[] {
    if(subcategories.length === 0) {
      return items;
    }
    return items.filter(item => {
      return subcategories.includes(item.subCategory);
    });
  }

  // filterByCuisine(items: Item[], cuisines: string[]): Item[] {
  //   if(cuisines.length === 0) {
  //     return items;
  //   }
  //   return items.filter(item => {
  //     return cuisines.includes(item.cuisine);
  //   });
  // }
}
