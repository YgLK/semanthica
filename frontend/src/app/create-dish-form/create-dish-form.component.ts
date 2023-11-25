import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Filter} from "../../models/filter";
import {FilterService} from "../shared/filter.service";
import {ItemService} from "../shared/item.service";
import {Item} from "../../models/item";

@Component({
  selector: 'app-create-dish-form',
  templateUrl: './create-dish-form.component.html',
  styleUrls: ['./create-dish-form.component.css']
})
export class CreateDishFormComponent implements OnInit {
  // passed to update min/max price
  filter: Filter;
  categories: any[] = [
    {
      "category_name": "Electronics",
      "subcategories": [
        "Computers & Accessories",
        "Television & Video",
        "Camera, Photo & Video",
        "Headphones",
        "Cell Phones & Accessories"
      ]
    },
    {
      "category_name": "Books",
      "subcategories": [
        "Fiction",
        "Non-Fiction",
        "Children's Books",
        "Mystery & Thrillers",
        "Science Fiction & Fantasy"
      ]
    },
    {
      "category_name": "Clothing and Accessories",
      "subcategories": [
        "Men's Fashion",
        "Women's Fashion",
        "Kids & Baby",
        "Shoes",
        "Watches"
      ]
    },
    {
      "category_name": "Home and Kitchen",
      "subcategories": [
        "Furniture",
        "Home Décor",
        "Kitchen & Dining",
        "Bedding",
        "Bath"
      ]
    }
  ];
  // default selected values
  categoriesUnique = this.categories.map(category => category.category_name);
  categorySelect = this.categoriesUnique[0];
  subCategoriesUnique = this.categories.find(category => category.category_name === this.categorySelect)?.subcategories;
  subCategorySelect = "Computers & Accessories";

  // form group
  itemForm!: FormGroup;
  // used to show prompt when new item is added
  isSubmitted: boolean;

  constructor(private filterService: FilterService, private itemService: ItemService) {
    this.filter = filterService.filter;
  }

  ngOnInit(): void {
    let name = new FormControl(null, Validators.required);
    let description = new FormControl(null, Validators.required);
    let category = new FormControl(null, Validators.required);
    let subCategory = new FormControl(null, Validators.required);
    let stockQuantity = new FormControl(null, Validators.required);
    let price = new FormControl(null, Validators.required);
    let imageUrls = new FormControl(null, Validators.required);
    this.itemForm = new FormGroup({
      name: name,
      description: description,
      category: category,
      subCategory: subCategory,
      stockQuantity: stockQuantity,
      price: price,
      imageUrls: imageUrls
    });
  }

  inputValid() {
    // check if all fields are valid
    return this.itemForm.valid;
  }

  onCategoryChange() {
    // update subcategories when category is changed
    this.subCategoriesUnique = this.categories.find(category => category.category_name === this.categorySelect)?.subcategories;
  }

  addNewItem(formValues: any) {
    if (this.itemForm.valid){
      let imageUrls = formValues.imageUrls.split(',').map((imageUrl: string) => imageUrl.trim());

      let newItem = new Item();
      newItem.name = formValues.name;
      newItem.description = formValues.description;
      newItem.mainCategory = formValues.category;
      newItem.subCategory = formValues.subCategory;
      newItem.stockQuantity = formValues.stockQuantity;
      newItem.price = formValues.price;
      newItem.imageUrls = imageUrls;
      this.itemService.addItem(newItem);

      // update min/max price in filter
      this.filter.minPrice = Math.min(this.filter.minPrice, formValues.price);
      this.filter.maxPrice = Math.max(this.filter.maxPrice, formValues.price);
      // show prompt when new item is added
      this.isSubmitted = true;
      // reset form
      this.itemForm.reset();
      // set default selected values
      this.itemForm.controls['category'].setValue(this.categories[1]);
      this.itemForm.controls['subCategory'].setValue(this.subCategoriesUnique[0]);
    } else {
      console.log('Something went wrong. Please check your input.');
    }
  }

  validateItemName() {
    return this.itemForm.controls['name'].valid || this.itemForm.controls['name'].untouched;
  }

  validateDescription() {
    return this.itemForm.controls['description'].valid || this.itemForm.controls['description'].untouched;
  }

  validateStockQuantity() {
    return this.itemForm.controls['stockQuantity'].valid || this.itemForm.controls['stockQuantity'].untouched;
  }

  validatePrice() {
    return this.itemForm.controls['price'].valid || this.itemForm.controls['price'].untouched;
  }

  validateImageUrls() {
    return this.itemForm.controls['imageUrls'].valid || this.itemForm.controls['imageUrls'].untouched;
  }
}
