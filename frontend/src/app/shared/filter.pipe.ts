import { Pipe, PipeTransform } from '@angular/core';
import {Filter} from "../../models/filter";
import {Item} from "../../models/item";

@Pipe({
  name: 'filterPipe',
  pure: false
})
export class FilterPipe implements PipeTransform {
  transform(items: Item[], filter: Filter): Item[] {
    let filtered = this.filterByPrice(items, filter.minPrice, filter.maxPrice)
    filtered = this.filterByCategory(filtered, filter.filterCategories);
    return filtered;
  }

  filterByPrice(items: Item[], minPrice: number, maxPrice:number): Item[] {
    if (minPrice > maxPrice) {
      // console.log('PRICE FILTER ERROR: minPrice > maxPrice');
      return items;
    }
    return items.filter(item => {
      return item.price >= minPrice && item.price <= maxPrice;
    });
  }

  filterByCategory(items: Item[], categories: string[]): Item[] {
    if(categories.length === 0) {
      return items;
    }
    return items.filter(item => {
      return categories.includes(item.mainCategory);
    });
  }
}
