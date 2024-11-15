export class ProductCard {
  static create(product, label) {
    const card = document.createElement('div');
    card.className = 'cyber-card';
    
    const savings = product.getSavings();
    const savingsClass = savings > 0 ? 'text-accent' : '';
    
    card.innerHTML = `
      <h3>${label}</h3>
      <div class="cyber-card-content">
        <p><strong>Product:</strong> ${product.name}</p>
        <p><strong>Current Price:</strong> <span class="price">$${product.price.toFixed(2)}</span></p>
        <p><strong>Previous Price:</strong> <span class="prev-price">$${product.prevPrice.toFixed(2)}</span></p>
        <p><strong>Savings:</strong> <span class="${savingsClass}">$${savings.toFixed(2)}</span></p>
        ${product.link ? `<a href="${product.link}" target="_blank" class="cyber-link">VIEW ON AMAZON</a>` : ''}
      </div>
    `;
    
    // Add hover effect
    card.addEventListener('mouseover', () => {
      card.style.transform = 'scale(1.02)';
      card.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mouseout', () => {
      card.style.transform = 'scale(1)';
    });
    
    return card;
  }
}