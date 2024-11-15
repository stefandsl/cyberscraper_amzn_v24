import { AmazonScraper } from './services/AmazonScraper.js';
import { ProductCard } from './ui/ProductCard.js';

class App {
  constructor() {
    this.scraper = new AmazonScraper();
    this.searchButton = document.getElementById('searchButton');
    this.searchInput = document.getElementById('searchInput');
    this.loadingDiv = document.getElementById('loading');
    this.resultsDiv = document.getElementById('results');
    
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    this.searchButton.addEventListener('click', () => this.handleSearch());
    this.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleSearch();
      }
    });
  }

  async handleSearch() {
    const searchTerm = this.searchInput.value.trim();
    if (!searchTerm) return;

    try {
      this.loadingDiv.style.display = 'block';
      this.resultsDiv.innerHTML = '';

      const products = await this.scraper.searchProducts(searchTerm);
      
      if (products.length === 0) {
        this.resultsDiv.innerHTML = '<p>No products found.</p>';
        return;
      }

      const cheapestProduct = this.scraper.findCheapestProduct(products);
      const bestDeal = this.scraper.findBestDeal(products);

      this.resultsDiv.appendChild(ProductCard.create(cheapestProduct, 'Cheapest Product'));
      this.resultsDiv.appendChild(ProductCard.create(bestDeal, 'Best Deal'));
    } catch (error) {
      this.resultsDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    } finally {
      this.loadingDiv.style.display = 'none';
    }
  }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new App();
});