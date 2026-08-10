import React, { useState, useEffect } from 'react';
import { X, Heart, Star, ShoppingBag, Check } from 'lucide-react';
import './ProductModal.css';

export default function ProductModal({
  product,
  isOpen,
  onClose,
  isWishlisted,
  onWishlistToggle,
  onAddToCart
}) {
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // Sync state when product changes
  useEffect(() => {
    if (product) {
      setSelectedImage(product.images[0]);
      setSelectedSize(product.sizes[0] || '');
      setSelectedColor(product.colors[0] || null);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  // Handle adding to cart with local loader micro-animation
  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      onAddToCart({
        ...product,
        selectedSize,
        selectedColor: selectedColor?.name || ''
      });
      setIsAdding(false);
    }, 600);
  };

  // Render stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`star-icon ${i <= fullStars ? 'filled' : ''}`}
          size={14}
        />
      );
    }
    return stars;
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content product-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="product-modal-grid">
          {/* Left Panel: Image Gallery */}
          <div className="product-gallery">
            <div className="gallery-main-image-wrapper">
              <img 
                src={selectedImage} 
                alt={product.name} 
                className="gallery-main-image" 
              />
            </div>
            
            {/* Gallery Thumbnails */}
            <div className="gallery-thumbnails">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  className={`thumbnail-btn ${selectedImage === img ? 'active' : ''}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={`${product.name} gallery ${idx + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel: Product Details */}
          <div className="product-details-panel">
            <span className="details-category">{product.category}</span>
            <h2 className="details-title">{product.name}</h2>
            
            <div className="details-rating-row">
              <div className="stars-container">{renderStars(product.rating)}</div>
              <span className="details-rating-val">{product.rating}</span>
              <span className="details-reviews-count">({product.reviewsCount} reviews)</span>
            </div>

            <div className="details-price">${product.price}</div>

            <p className="details-description">{product.description}</p>

            {/* Color swatches selector */}
            <div className="details-option-group">
              <span className="option-label">Color: <span className="option-selected-val">{selectedColor?.name}</span></span>
              <div className="color-swatches">
                {product.colors.map((color, idx) => (
                  <button
                    key={idx}
                    className={`color-swatch-btn ${selectedColor?.name === color.name ? 'active' : ''}`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedColor(color)}
                    title={color.name}
                  >
                    {selectedColor?.name === color.name && (
                      <Check size={12} color={color.hex === '#111111' || color.hex === '#1C1A17' ? '#FFFFFF' : '#111111'} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size selector buttons */}
            <div className="details-option-group">
              <span className="option-label">Size: <span className="option-selected-val">{selectedSize}</span></span>
              <div className="size-buttons">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions: Add to Cart, Add to Wishlist */}
            <div className="details-actions">
              {product.inStock ? (
                <button 
                  className={`btn-primary add-to-cart-modal-btn ${isAdding ? 'loading' : ''}`}
                  onClick={handleAddToCart}
                  disabled={isAdding}
                >
                  <ShoppingBag size={16} />
                  {isAdding ? 'Adding to Closet...' : 'Add to Shopping Bag'}
                </button>
              ) : (
                <button className="btn-primary add-to-cart-modal-btn sold-out" disabled>
                  Sold Out
                </button>
              )}

              <button
                className={`btn-secondary wishlist-modal-btn ${isWishlisted ? 'active' : ''}`}
                onClick={() => onWishlistToggle(product.id)}
              >
                <Heart size={16} fill={isWishlisted ? "var(--accent)" : "none"} />
                {isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Details Bullet List */}
            <div className="details-specifications">
              <span className="spec-title">Product Details</span>
              <ul className="spec-list">
                {product.details.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
                <li>Availability: {product.inStock ? 'In stock, ready to ship' : 'Unavailable'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
