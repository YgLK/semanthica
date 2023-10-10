import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-menu-filter',
  templateUrl: './menu-filter.component.html',
  styleUrls: ['./menu-filter.component.css']
})
export class MenuFilterComponent {
  @Input() allCuisines: any;
  @Input() allCategories: any;
  // filters
  @Input() filter: any;

  // check if the cuisine filter is applied
  onChangeCuisine(cuisine: any) {
    if (this.filter.filterCuisines.includes(cuisine)) {
      this.filter.filterCuisines.splice(this.filter.filterCuisines.indexOf(cuisine), 1);
    } else {
      this.filter.filterCuisines.push(cuisine);
    }
    console.log(this.filter.filterCuisines)
  }

  //check if the filter is applied
  onChangeCategory(category: any) {
    if (this.filter.filterCategories.includes(category)) {
      this.filter.filterCategories.splice(this.filter.filterCategories.indexOf(category), 1);
    } else {
      this.filter.filterCategories.push(category);
    }
    console.log(this.filter.filterCategories)
  }
}
