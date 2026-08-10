import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, X } from 'lucide-react';
import './Header.css';

export default function Header({
  cartCount,
  wishlistCount,
  onCartOpen,
  onWishlistOpen,
  onExploreClick,
  searchQuery,
  setSearchQuery,
  setSelectedCategory
}) {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="site-header">
      <div className="header-container container">
        <div className="header-catalog">
          <button className="catalog-link" onClick={onExploreClick}>
            Catalog
          </button>
        </div>

        {/* Brand Logo */}
        <div className="header-logo">
          <a href="#" onClick={() => setSelectedCategory('All')}>
            <h1>ZYVORA</h1>
            <span className="logo-sub">HAUTE COUTURE</span>
          </a>
        </div>

        {/* Action Icons */}
        <div className="header-actions">
          {/* Expanding Search Bar */}
          <div className={`search-wrapper ${showSearch ? 'expanded' : ''}`}>
            <button 
              className="action-btn search-trigger" 
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Search products"
            >
              <Search size={20} />
            </button>
            <input
              type="text"
              placeholder="Search products..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {showSearch && searchQuery && (
              <button 
                className="search-clear-btn" 
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Wishlist Trigger */}
          <button 
            className="action-btn wishlist-btn" 
            onClick={onWishlistOpen}
            aria-label="Open wishlist"
          >
            <Heart size={20} />
            {wishlistCount > 0 && <span className="action-badge">{wishlistCount}</span>}
          </button>

          {/* Shopping Cart Trigger */}
          <button 
            className="action-btn cart-btn" 
            onClick={onCartOpen}
            aria-label="Open cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="action-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
