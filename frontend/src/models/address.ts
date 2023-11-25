

export class Address {
  constructor(
    public street: string,
    public city: string,
    public postalCode: string,
    public country: string
  ) {}

  toJSON() {
    return {
      street: this.street,
      city: this.city,
      postal_code: this.postalCode,
      country: this.country
    };
  }

  static fromJSON(address: any): Address {
    return new Address(
      address.street,
      address.city,
      address.postal_code,
      address.country
    );
  }
}
