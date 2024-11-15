import axios from 'axios';
import axiosRetry from 'axios-retry';

export class ProxyService {
  constructor() {
    this.proxyList = [
      'https://api.scraperapi.com/?api_key=free_demo_key&url=',
      'https://proxy.scrapeops.io/v1/?api_key=free_demo_key&url=',
      'https://api.scrapingant.com/v2/general?url=',
      'https://api.allorigins.win/raw?url='
    ];
    this.currentProxyIndex = 0;
    
    // Configure axios retry logic
    axiosRetry(axios, { 
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || 
               error.response?.status === 429 || // Too Many Requests
               error.response?.status === 403;   // Forbidden
      }
    });
  }

  getCurrentProxy() {
    return this.proxyList[this.currentProxyIndex];
  }

  rotateProxy() {
    this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxyList.length;
  }

  async fetch(url) {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };

    for (let attempt = 0; attempt < this.proxyList.length; attempt++) {
      try {
        const proxyUrl = this.getCurrentProxy() + encodeURIComponent(url);
        const response = await axios.get(proxyUrl, { headers });
        return response.data;
      } catch (error) {
        console.warn(`Proxy attempt ${attempt + 1} failed:`, error.message);
        this.rotateProxy();
        
        if (attempt === this.proxyList.length - 1) {
          throw new Error('All proxy attempts failed');
        }
      }
    }
  }
}