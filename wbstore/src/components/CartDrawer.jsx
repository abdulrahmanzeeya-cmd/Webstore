import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, Tag } from 'lucide-react';
import './CartDrawer.css';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  promoDiscount,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
  onCheckoutClick
}) {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  // Calculate pricing metrics
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const shippingFee = subtotal > 200 || appliedPromo?.type === 'shipping' ? 0 : 15;
  
  // Calculate discount
  let discountAmount = 0;
  if (appliedPromo && appliedPromo.type === 'percent') {
    discountAmount = (subtotal * appliedPromo.value) / 100;
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount * 0.08; // 8% sales tax
  const total = taxableAmount + shippingFee + tax;

  // Handle promo code submit
  const handlePromoSubmit = (e) => {
    e.preventDefault();
    setPromoError('');
    if (!promoInput.trim()) return;

    const success = onApplyPromo(promoInput.toUpperCase().trim());
    if (!success) {
      setPromoError('Invalid promo code. Try WELCOME10 or ELEGANCE20.');
    } else {
      setPromoInput('');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-backdrop" onClick={onClose}></div>

      {/* Drawer */}
      <div className="drawer right cart-drawer">
        <div className="drawer-header">
          <h2>Shopping Bag</h2>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close cart">
            <X size={24} />
          </button>
        </div>

        <div className="drawer-body cart-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <ShoppingBag size={48} className="empty-cart-icon" />
              <h3>Your closet is empty</h3>
              <p>Explore the collection and curate your signature look.</p>
              <button className="btn-primary shop-now-btn" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item, idx) => (
                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${idx}`} className="cart-item">
                  <div className="cart-item-image-wrapper">
                    <img src={item.images[0]} alt={item.name} />
                  </div>
                  
                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <div className="cart-item-meta">
                      {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                    </div>
                    <div className="cart-item-price">${item.price}</div>
                    
                    <div className="cart-item-actions-row">
                      {/* Quantity controls */}
                      <div className="quantity-selector">
                        <button
                          className="qty-btn"
                          onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="qty-val">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Remove button */}
                      <button
                        className="cart-item-remove-btn"
                        onClick={() => onRemoveItem(item.id, item.selectedSize, item.selectedColor)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="drawer-footer cart-footer">
            {/* Promo code input form */}
            <form onSubmit={handlePromoSubmit} className="promo-form">
              <div className="promo-input-row">
                <input
                  type="text"
                  placeholder="PROMO CODE"
                  className="promo-input"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                />
                <button type="submit" className="btn-primary promo-apply-btn">
                  Apply
                </button>
              </div>
              {promoError && <span className="promo-error-msg">{promoError}</span>}
            </form>

            {/* Applied Promo tags */}
            {appliedPromo && (
              <div className="applied-promo-tag">
                <Tag size={12} className="promo-tag-icon" />
                <span>Promo Applied: <strong>{appliedPromo.label}</strong></span>
                <button className="remove-promo-btn" onClick={onRemovePromo} aria-label="Remove promo">
                  <X size={12} />
                </button>
              </div>
            )}

            {/* Financial summary calculations */}
            <div className="cart-summary-calculations">
              <div className="calc-row">
                <span className="calc-label">Subtotal</span>
                <span className="calc-val">${subtotal.toFixed(2)}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="calc-row discount-row">
                  <span className="calc-label">Discount ({appliedPromo.value}%)</span>
                  <span className="calc-val">—${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="calc-row">
                <span className="calc-label">Estimated Shipping</span>
                <span className="calc-val">
                  {shippingFee === 0 ? 'Complimentary' : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>

              <div className="calc-row">
                <span className="calc-label">Sales Tax (8%)</span>
                <span className="calc-val">${tax.toFixed(2)}</span>
              </div>

              <div className="calc-row total-row">
                <span className="calc-label">Total Due</span>
                <span className="calc-val">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action button */}
            <button className="btn-primary checkout-action-btn" onClick={onCheckoutClick}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
