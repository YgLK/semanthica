export class Order {
  constructor(
    public id: number,
    public userId: number,
    public date: string,
    public dishes: Map<number, number>,
    public total: number,
  ){}

  getOrderJson() {
    class OrderEntry {
      constructor(
        public dishId: number,
        public quantity: number
      ){}
    }
    let entries = Array.from(this.dishes.entries()).map((entry) => new OrderEntry(entry[0], entry[1]));

    return {
      id: this.id,
      userId: this.userId,
      date: this.date,
      dishes: entries,
      total: this.total
    };
  }
}
