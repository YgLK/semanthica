import {Review} from "./review";

export class Item {

  constructor(public id: number,
              public name: string,
              public description: string,
              public mainCategory: string,
              public subCategory: string,
              // public reviews: string[], // Review[],
              // public ingredients: string[],
              public stockQuantity: number,
              public price: number,
              public imageUrl: string
  ){}

  // public decreaseAvailability() {
  //   this.maxAvailable--;
  // }
  //
  // public getAvgRating() {
  //   if(this.ratings.length === 0) {
  //     // console.log('No ratings for ' + this.name + ' yet.');
  //     return -1;
  //   }
  //  return Number(this.ratings.reduce((a, b) => a + b, 0) / this.ratings.length).toFixed(2);
  // }
}
