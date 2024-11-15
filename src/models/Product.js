export class Product {
  constructor(name, price, prevPrice, link) {
    this.name = name;
    this.price = price;
    this.prevPrice = prevPrice;
    this.link = link;
  }

  getSavings() {
    return this.prevPrice - this.price;
  }

  toJSON() {
    return {
      name: this.name,
      price: this.price,
      prevPrice: this.prevPrice,
      link: this.link,
      savings: this.getSavings()
    };
  }
}