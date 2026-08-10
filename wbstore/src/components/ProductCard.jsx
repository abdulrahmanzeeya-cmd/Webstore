import React, { useState } from 'react';
import { Heart, Star, Eye } from 'lucide-react';
import './ProductCard.css';

export default function ProductCard({
  product,
  isWishlisted,
  onWishlistToggle,
  onQuickViewClick,
  onAddToCartDirect
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleMouseEnter = () => {
    if (product.images.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  const handleMouseLeave = () => {
    setCurrentImageIndex(0);
  };

  // Render stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`star-icon ${i <= fullStars ? 'filled' : ''} ${i === fullStars + 1 && hasHalf ? 'half' : ''}`}
          size={12}
        />
      );
    }
    return stars;
  };

  return (
    <div 
      className="product-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Product Image and Badges */}
      <div className="product-media-wrapper">
        <img 
          src={product.images[currentImageIndex]} 
          alt={product.name} 
          className="product-card-image"
          loading="lazy"
        />
        
        {/* Out of Stock Banner */}
        {!product.inStock && (
          <span className="out-of-stock-badge">Sold Out</span>
        )}

        {/* Wishlist toggle */}
        <button
          className={`wishlist-card-btn ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle(product.id);
          }}
          aria-label="Add to wishlist"
        >
          <Heart size={16} fill={isWishlisted ? "var(--accent)" : "none"} />
        </button>

        {/* Quick View and Action Overlay */}
        <div className="media-overlay">
          <button 
            className="overlay-action-btn"
            onClick={() => onQuickViewClick(product.id)}
            aria-label="Quick View product"
          >
            <Eye size={16} /> Quick View
          </button>
          
          {product.inStock && (
            <button 
              className="overlay-cart-btn"
              onClick={() => onAddToCartDirect(product)}
              aria-label="Add to cart"
            >
              + Add to Cart
            </button>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="product-card-info">
        <div className="card-top-row">
          <span className="card-category">{product.category}</span>
          <div className="card-rating">
            {renderStars(product.rating)}
            <span className="rating-count">({product.reviewsCount})</span>
          </div>
        </div>
        
        <h3 className="card-product-title" onClick={() => onQuickViewClick(product.id)}>
          {product.name}
        </h3>
        
        <div className="card-bottom-row">
          <span className="card-price">${product.price}</span>
        </div>
      </div>
    </div>
  );
}
