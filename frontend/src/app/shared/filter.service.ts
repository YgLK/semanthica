import { Injectable } from '@angular/core';
import {Filter} from "../../models/filter";

@Injectable({
  providedIn: 'root'
})
/*
  filter settings saved in the service as singleton
   (for now used to share and update minPrice, maxPrice between components)
 */
export class FilterService {
  filter: Filter;

  constructor() {
    this.filter = new Filter();
    // set init max, min prices
    this.filter.minPrice = 0;
    this.filter.maxPrice = Number.MAX_SAFE_INTEGER;
  }
}
