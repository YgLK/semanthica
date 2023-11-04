import {Component} from '@angular/core';
import {ItemService} from "../shared/item.service";
import {SearchService} from "../shared/search.service";
import {FilterService} from "../shared/filter.service";

@Component({
  selector: 'search-bar',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchQuery: string = '';

  constructor(private itemService: ItemService,
              private searchService: SearchService,
              private filterService: FilterService) {}

  classicSearch() {
    let items = this.searchService.classicSearch(this.searchQuery);
    this.itemService.updateItemsList(items);
    this.filterService.filter.filterCategories = [];
  }

  semanticSearch() {
    let items = this.searchService.semanticSearch(this.searchQuery);
    this.itemService.updateItemsList(items);
    this.filterService.filter.filterCategories = [];
  }

  imageSearch() {
    let items = this.searchService.imageSearch(this.searchQuery);
    this.itemService.updateItemsList(items);
    this.filterService.filter.filterCategories = [];
  }
}
