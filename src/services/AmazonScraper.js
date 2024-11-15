import * as cheerio from 'cheerio';
import { Product } from '../models/Product.js';
import { ProxyService } from './ProxyService.js';

export class AmazonScraper {
  constructor() {
    this.proxyService = new ProxyService();
  }

  convertPriceToNumber(price) {
    if (!price) return 0;
    const cleanPrice = price.replace(/[^0-9.]/g, '');
    return parseFloat(cleanPrice);
  }

  async searchProducts(searchTerm) {
    try {
      const url = `https://www.amazon.com/s?k=${encodeURIComponent(searchTerm)}`;
      const html = await this.proxyService.fetch(url);
      const $ = cheerio.load(html);
      const products = [];

      $('.s-result-item').each((i, element) => {
        const name = $(element).find('h2 span').text().trim();
        const priceElement = $(element).find('.a-price .a-offscreen').first();
        const prevPriceElement = $(element).find('.a-text-price .a-offscreen').first();
        const link = $(element).find('h2 a').attr('href');

        if (name && priceElement.length) {
          const price = this.convertPriceToNumber(priceElement.text());
          const prevPrice = prevPriceElement.length ? 
            this.convertPriceToNumber(prevPriceElement.text()) : 
            price;
          const fullLink = link ? `https://www.amazon.com${link}` : '';

          if (price > 0) {
            products.push(new Product(name, price, prevPrice, fullLink));
          }
        }
      });

      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  findCheapestProduct(products) {
    return products.reduce((min, p) => p.price < min.price ? p : min, products[0]);
  }

  findBestDeal(products) {
    return products.reduce((max, p) => p.getSavings() > max.getSavings() ? p : max, products[0]);
  }
}