import {Component, Input} from '@angular/core';
import {MatCheckboxChange} from "@angular/material/checkbox";

@Component({
  selector: 'app-menu-filter',
  templateUrl: './menu-filter.component.html',
  styleUrls: ['./menu-filter.component.css']
})
export class MenuFilterComponent {
  @Input() allCategories: any;
  // filters
  @Input() filter: any;

  //check if the filter is applied
  onChangeCategory(event: MatCheckboxChange, category: any) {
    if (event.source.checked) {
      if(this.filter.filterCategories.length == this.allCategories.length){
        this.filter.filterCategories = [category];
      } else {
        this.filter.filterCategories.push(category);
      }
    }
    else {
      this.filter.filterCategories.splice(this.filter.filterCategories.indexOf(category), 1);
      if (this.filter.filterCategories.length === 0) {
        this.filter.filterCategories = this.allCategories;
      }
    }
  }
}
