export class Filter {
  public filterCategories: string[] = [];
  public minPrice: number = 0;
  public maxPrice: number = Number.MAX_SAFE_INTEGER;

  constructor() {}

  setMaxPrice(maxPrice: any) {
    if (maxPrice == null) {
        console.log('PRICE FILTER ERROR: maxPrice is null, maxPrice set to INF');
        this.maxPrice = Number.MAX_SAFE_INTEGER;
    } else {
        let newMax = Number(maxPrice);
        if (newMax < this.minPrice) {
            console.log('PRICE FILTER ERROR: maxPrice < minPrice');
            console.log("Setting maxPrice to INF");
            this.maxPrice = Number.MAX_SAFE_INTEGER;
        } else {
            this.maxPrice = newMax;
        }
    }
  }

  setMinPrice(minPrice: any) {
      if (minPrice == null) {
          console.log('PRICE FILTER ERROR: minPrice is null, minPrice set to 0');
          this.minPrice = 0;
      } else {
          let newMin = Number(minPrice);
          if (newMin > this.maxPrice) {
              console.log('PRICE FILTER ERROR: minPrice > maxPrice\nSetting minPrice to 0');
              this.minPrice = 0;
          } else {
              this.minPrice = Math.max(0, newMin);
          }
      }
  }
}
