import { Pipe, PipeTransform } from '@angular/core';
import {Filter} from "../../models/filter";
import {Item} from "../../models/item";

@Pipe({
  name: 'filterPipe',
  pure: false
})
export class FilterPipe implements PipeTransform {
  transform(items: Item[], filter: Filter): Item[] {
    // console.log('filter: ' + filter);
    // let filtered = this.filterByName(items, filter.filterText);
    let filtered = this.filterByPrice(items, filter.minPrice, filter.maxPrice)
    // filtered = this.filterByRating(filtered, filter.minRating);
    filtered = this.filterByCategory(filtered, filter.filterCategories);
    // filtered = this.filterBySubcategory(filtered, filter.filterSubcategories);
    return filtered;
  }

  // filterByName(items: Item[], searchText: string): Item[] {
  //   // console.log('searchText: ' + searchText);
  //   if (!items)
  //     return [];
  //   if (!searchText)
  //     return items;
  //   searchText = searchText.toLowerCase();
  //   return items.filter(item => {
  //     return item.name.toLowerCase().includes(searchText);
  //   });
  // }

  filterByPrice(items: Item[], minPrice: number, maxPrice:number): Item[] {
    if (minPrice > maxPrice) {
      // console.log('PRICE FILTER ERROR: minPrice > maxPrice');
      return items;
    }
    return items.filter(item => {
      return item.price >= minPrice && item.price <= maxPrice;
    });
  }

  // TODO: create sort by rating instead of filtering by rating

  filterByCategory(items: Item[], categories: string[]): Item[] {
    if(categories.length === 0) {
      return items;
    }
    return items.filter(item => {
      return categories.includes(item.mainCategory);
    });
  }

  // filterBySubcategory(items: Item[], subcategories: string[]): Item[] {
  //   if(subcategories.length === 0) {
  //     return items;
  //   }
  //   return items.filter(item => {
  //     return subcategories.includes(item.subCategory);
  //   });
  // }
}
