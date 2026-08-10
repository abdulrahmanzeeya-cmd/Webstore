import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import './WishlistDrawer.css';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveFromWishlist,
  onMoveToCart
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-backdrop" onClick={onClose}></div>

      {/* Drawer */}
      <div className="drawer left wishlist-drawer">
        <div className="drawer-header">
          <h2>Your Wishlist</h2>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close wishlist">
            <X size={24} />
          </button>
        </div>

        <div className="drawer-body wishlist-body">
          {wishlistItems.length === 0 ? (
            <div className="wishlist-empty-state">
              <Heart size={48} className="empty-wishlist-icon" />
              <h3>Your wishlist is empty</h3>
              <p>Save pieces you love to curate your dream editorial wardrobe.</p>
              <button className="btn-primary browse-btn" onClick={onClose}>
                Browse Collections
              </button>
            </div>
          ) : (
            <div className="wishlist-items-list">
              {wishlistItems.map((item) => (
                <div key={item.id} className="wishlist-item">
                  <div className="wishlist-item-image-wrapper">
                    <img src={item.images[0]} alt={item.name} />
                  </div>
                  
                  <div className="wishlist-item-details">
                    <span className="wishlist-item-category">{item.category}</span>
                    <h4 className="wishlist-item-name">{item.name}</h4>
                    <div className="wishlist-item-price">${item.price}</div>
                    
                    <div className="wishlist-item-actions">
                      {/* Move to bag option */}
                      {item.inStock ? (
                        <button
                          className="btn-accent move-to-bag-btn"
                          onClick={() => onMoveToCart(item)}
                        >
                          <ShoppingBag size={12} /> Add to Bag
                        </button>
                      ) : (
                        <span className="wishlist-sold-out">Sold Out</span>
                      )}

                      {/* Remove item */}
                      <button
                        className="wishlist-remove-btn"
                        onClick={() => onRemoveFromWishlist(item.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
