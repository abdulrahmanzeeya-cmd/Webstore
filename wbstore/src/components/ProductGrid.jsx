import React from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

export default function ProductGrid({
  products,
  wishlist,
  onWishlistToggle,
  onQuickViewClick,
  onAddToCartDirect
}) {
  if (products.length === 0) {
    return (
      <div className="product-grid-empty container">
        <h3 className="empty-title">No pieces found</h3>
        <p className="empty-text">
          We couldn't find any curated items matching your criteria. Try adjusting your search queries or category filters.
        </p>
      </div>
    );
  }

  return (
    <section className="product-grid-section">
      <div className="product-grid container">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isWishlisted={wishlist.includes(product.id)}
            onWishlistToggle={onWishlistToggle}
            onQuickViewClick={onQuickViewClick}
            onAddToCartDirect={onAddToCartDirect}
          />
        ))}
      </div>
    </section>
  );
}
