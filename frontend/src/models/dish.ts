import {Review} from "./review";

export class Dish {

  constructor(public id: number,
              public name: string,
              public ratings: number[],
              public reviews: Review[],
              public cuisine: string,
              public category: string,
              public ingredients: string[],
              public maxAvailable: number,
              public price: number,
              public description: string,
              public imageUrls: string[]
  ){}

  public decreaseAvailability() {
    this.maxAvailable--;
  }

  public getAvgRating() {
    if(this.ratings.length === 0) {
      // console.log('No ratings for ' + this.name + ' yet.');
      return -1;
    }
   return Number(this.ratings.reduce((a, b) => a + b, 0) / this.ratings.length).toFixed(2);
  }
}
