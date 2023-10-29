export class OrderRecord {
  constructor(
    public item_id: number,
    public quantity: number,
    public item_name?: string,
    public item_price?: number
  ){}
}

export enum OrderStatus {
  CREATED = "created",
  PROCESSING = "processing",
  DELIVERED = "delivered",
  CANCELLED = "cancelled"
}

export class Order {
  constructor(
    public userId: number,
    public createdAt: string,
    public status: OrderStatus,
    public orderRecords: OrderRecord[],
    public total: number,
    public id?: number // id is set after adding the order to the database
  ){}

  getOrderJson() {
    return {
      user_id: this.userId,
      status: this.status,
      created_at: this.createdAt,
      order_records: this.orderRecords,
      total: this.total
    };
  }

  getItemIds(): Set<number> {
    const itemIds: number[] = this.orderRecords.map(orderRecord => orderRecord.item_id);
    return new Set<number>(itemIds);
  }
}
