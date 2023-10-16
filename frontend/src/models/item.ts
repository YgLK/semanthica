import {Review} from "./review";

export class Item {

  constructor(public id: number,
              public name: string,
              public description: string,
              public mainCategory: string,
              public subCategory: string,
              // TODO: load reviews after somebody click on item
              // public reviews: Review[],
              public stockQuantity: number,
              public price: number,
              public imageUrls: string[]
  ){}

  public decreaseAvailability() {
    this.stockQuantity--;
  }

  // public getAvgRating() {
  //   if(this.ratings.length === 0) {
  //     // console.log('No ratings for ' + this.name + ' yet.');
  //     return -1;
  //   }
  //  return Number(this.ratings.reduce((a, b) => a + b, 0) / this.ratings.length).toFixed(2);
  // }

  static createItem(itemData: any): Item {
    return new Item(
      itemData.id,
      itemData.name,
      itemData.description,
      itemData.main_category,
      itemData.sub_category,
      // itemData.reviews,
      itemData.stock_quantity,
      itemData.price,
      [itemData.image_url] // TODO: handle multiple images, for image search use the main one (first)
    );
  }
}
