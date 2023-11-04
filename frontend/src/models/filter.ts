export class Filter {
  // public filterText: string = '';
  public filterCategories: string[] = [];
  // public filterSubcategories: string[] = [];
  public minPrice: number = 0;
  public maxPrice: number = Number.MAX_SAFE_INTEGER;
  public minRating: number = 0;

  constructor() {}
}
