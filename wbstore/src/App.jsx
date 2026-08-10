import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Filters from './components/Filters';
import ProductGrid from './components/ProductGrid';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import CheckoutModal from './components/CheckoutModal';
import Toast from './components/Toast';
import { products, promoCodes } from './data/products';
import './App.css';

export default function App() {
  // Application State
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(400);
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  
  // Modal/Drawer controls
  const [activeProductId, setActiveProductId] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  // Promo code and Toasts
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Toast helper triggers
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add item to shopping bag
  const handleAddToCart = (productSelection) => {
    setCart((prevCart) => {
      // Check if exact same item configuration is in cart
      const existingIdx = prevCart.findIndex(
        (item) =>
          item.id === productSelection.id &&
          item.selectedSize === productSelection.selectedSize &&
          item.selectedColor === productSelection.selectedColor
      );

      if (existingIdx > -1) {
        const newCart = [...prevCart];
        newCart[existingIdx].quantity += 1;
        addToast(`Increased quantity of ${productSelection.name} in bag!`, 'success');
        return newCart;
      } else {
        addToast(`${productSelection.name} added to your bag!`, 'success');
        return [...prevCart, { ...productSelection, quantity: 1 }];
      }
    });
  };

  // Quick Add directly from card
  const handleAddToCartDirect = (product) => {
    // Pick default size and color for speed
    const defaultSize = product.sizes[0] || 'OS';
    const defaultColor = product.colors[0]?.name || '';
    handleAddToCart({
      ...product,
      selectedSize: defaultSize,
      selectedColor: defaultColor
    });
  };

  // Update Cart Quantity
  const handleUpdateQuantity = (id, size, color, quantity) => {
    if (quantity <= 0) {
      handleRemoveCartItem(id, size, color);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.selectedSize === size && item.selectedColor === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Remove item from Cart
  const handleRemoveCartItem = (id, size, color) => {
    const item = cart.find(
      (i) => i.id === id && i.selectedSize === size && i.selectedColor === color
    );
    setCart((prevCart) =>
      prevCart.filter(
        (i) => !(i.id === id && i.selectedSize === size && i.selectedColor === color)
      )
    );
    if (item) {
      addToast(`${item.name} removed from bag`, 'info');
    }
  };

  // Toggle wishlist item
  const handleWishlistToggle = (id) => {
    const product = products.find((p) => p.id === id);
    setWishlist((prevWishlist) => {
      const isAlreadySaved = prevWishlist.includes(id);
      if (isAlreadySaved) {
        addToast(`${product.name} removed from wishlist`, 'info');
        return prevWishlist.filter((itemId) => itemId !== id);
      } else {
        addToast(`${product.name} saved to wishlist!`, 'success');
        return [...prevWishlist, id];
      }
    });
  };

  // Add to cart and remove from wishlist
  const handleMoveToCart = (product) => {
    handleAddToCartDirect(product);
    setWishlist((prev) => prev.filter((id) => id !== product.id));
  };

  // Apply Coupon code
  const handleApplyPromo = (code) => {
    const promo = promoCodes[code];
    if (promo) {
      setAppliedPromo(promo);
      addToast(`Promo code ${code} applied successfully!`, 'success');
      return true;
    }
    return false;
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    addToast('Promo code removed', 'info');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Scroll to catalogs target helper
  const handleExploreScroll = () => {
    const catalog = document.getElementById('products-catalog');
    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Core product filtering & sorting logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(
        (product) => product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }

    // Price range filter
    result = result.filter((product) => product.price <= priceRange);

    // In Stock filter
    if (inStockOnly) {
      result = result.filter((product) => product.inStock);
    }

    // Sorting configurations
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedCategory, searchQuery, priceRange, inStockOnly, sortBy]);

  // Derived state details
  const activeProduct = useMemo(() => {
    return products.find((p) => p.id === activeProductId) || null;
  }, [activeProductId]);

  const cartCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const wishlistCount = wishlist.length;

  const wishlistDetailedItems = useMemo(() => {
    return products.filter((p) => wishlist.includes(p.id));
  }, [wishlist]);

  return (
    <div className="app-root-layout">
      {/* Editorial Header */}
      <Header
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onCartOpen={() => setIsCartOpen(true)}
        onWishlistOpen={() => setIsWishlistOpen(true)}
        onExploreClick={handleExploreScroll}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Hero Banner Section */}
      <Hero onExploreClick={handleExploreScroll} />

      {/* Catalog Search & Filters Section */}
      <Filters
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        sortBy={sortBy}
        setSortBy={setSortBy}
        inStockOnly={inStockOnly}
        setInStockOnly={setInStockOnly}
        activeResultsCount={filteredProducts.length}
      />

      {/* Catalog Grid Section */}
      <ProductGrid
        products={filteredProducts}
        wishlist={wishlist}
        onWishlistToggle={handleWishlistToggle}
        onQuickViewClick={(id) => setActiveProductId(id)}
        onAddToCartDirect={handleAddToCartDirect}
      />

      {/* Product Quick View Detail Modal */}
      <ProductModal
        product={activeProduct}
        isOpen={activeProductId !== null}
        onClose={() => setActiveProductId(null)}
        isWishlisted={wishlist.includes(activeProductId || 0)}
        onWishlistToggle={handleWishlistToggle}
        onAddToCart={handleAddToCart}
      />

      {/* Shopping Cart Sliding Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={handleRemovePromo}
        onCheckoutClick={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Wishlist Sliding Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistDetailedItems}
        onRemoveFromWishlist={handleWishlistToggle}
        onMoveToCart={handleMoveToCart}
      />

      {/* Secure Checkout Step Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        appliedPromo={appliedPromo}
        onClearCart={handleClearCart}
      />

      {/* Global Toast System */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Modern footer details */}
      <footer className="site-footer">
        <div className="footer-content container">
          <div className="footer-brand">
            <h3>ZYVORA</h3>
            <p>Luxury craftsmanship, designed for modern longevity.</p>
          </div>
          <div className="footer-links">
            <div className="footer-links-col">
              <h4>COLLECTIONS</h4>
              <a href="#" onClick={() => setSelectedCategory('Apparel')}>Apparel</a>
              <a href="#" onClick={() => setSelectedCategory('Accessories')}>Accessories</a>
              <a href="#" onClick={() => setSelectedCategory('Jewelry')}>Jewelry</a>
              <a href="#" onClick={() => setSelectedCategory('Footwear')}>Footwear</a>
            </div>
            <div className="footer-links-col">
              <h4>CUSTOMER CARE</h4>
              <a href="#">Contact Us</a>
              <a href="#">Shipping & Returns</a>
              <a href="#">Care Instructions</a>
              <a href="#">Sustainability</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom container">
          <p>&copy; {new Date().getFullYear()} ZYVORA. All rights reserved. Designed for Editorial Excellence.</p>
        </div>
      </footer>
    </div>
  );
}
