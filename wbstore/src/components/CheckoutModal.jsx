import React, { useState } from 'react';
import { X, Lock, CheckCircle2, CreditCard, ChevronRight } from 'lucide-react';
import './CheckoutModal.css';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  appliedPromo,
  onClearCart
}) {
  const [step, setStep] = useState(1);
  const [shippingForm, setShippingForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: ''
  });
  const [shippingErrors, setShippingErrors] = useState({});

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: ''
  });
  const [paymentErrors, setPaymentErrors] = useState({});
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  if (!isOpen) return null;

  // Calculate pricing summaries
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = appliedPromo?.type === 'percent' ? (subtotal * appliedPromo.value) / 100 : 0;
  const shippingFee = subtotal > 200 || appliedPromo?.type === 'shipping' ? 0 : 15;
  const tax = (subtotal - discountAmount) * 0.08;
  const total = subtotal - discountAmount + shippingFee + tax;

  // Shipping Form Validate
  const handleShippingChange = (e) => {
    setShippingForm({ ...shippingForm, [e.target.name]: e.target.value });
    if (shippingErrors[e.target.name]) {
      setShippingErrors({ ...shippingErrors, [e.target.name]: '' });
    }
  };

  const validateShipping = () => {
    const errors = {};
    if (!shippingForm.name.trim()) errors.name = 'Full name is required';
    if (!shippingForm.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(shippingForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!shippingForm.address.trim()) errors.address = 'Shipping address is required';
    if (!shippingForm.city.trim()) errors.city = 'City is required';
    if (!shippingForm.zip.trim()) errors.zip = 'Zip code is required';
    
    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (validateShipping()) {
      setStep(2);
    }
  };

  // Payment Form Input formatting & Validate
  const handlePaymentChange = (e) => {
    let { name, value } = e.target;

    // Formatting rules
    if (name === 'cardNumber') {
      value = value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (value.length > 19) return; // 16 digits + 3 spaces max
    } else if (name === 'cardExpiry') {
      value = value.replace(/\D/g, '');
      if (value.length > 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      if (value.length > 5) return;
    } else if (name === 'cardCvv') {
      value = value.replace(/\D/g, '');
      if (value.length > 3) return;
    }

    setPaymentForm({ ...paymentForm, [name]: value });
    if (paymentErrors[name]) {
      setPaymentErrors({ ...paymentErrors, [name]: '' });
    }
  };

  const validatePayment = () => {
    const errors = {};
    if (!paymentForm.cardNumber || paymentForm.cardNumber.replace(/\s/g, '').length < 16) {
      errors.cardNumber = 'Invalid credit card number';
    }
    if (!paymentForm.cardName.trim()) {
      errors.cardName = 'Cardholder name is required';
    }
    if (!paymentForm.cardExpiry || paymentForm.cardExpiry.length < 5) {
      errors.cardExpiry = 'Expiry date (MM/YY) is required';
    }
    if (!paymentForm.cardCvv || paymentForm.cardCvv.length < 3) {
      errors.cardCvv = 'CVV is required';
    }

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (validatePayment()) {
      setIsSubmitting(true);
      
      // Simulate transaction api response delay
      setTimeout(() => {
        setIsSubmitting(false);
        setOrderNumber(`ME-${Math.floor(100000 + Math.random() * 900000)}`);
        setStep(3);
        onClearCart();
      }, 2000);
    }
  };

  // Reset modal states
  const handleClose = () => {
    setStep(1);
    setShippingForm({ name: '', email: '', address: '', city: '', zip: '' });
    setPaymentForm({ cardNumber: '', cardName: '', cardExpiry: '', cardCvv: '' });
    setShippingErrors({});
    setPaymentErrors({});
    setIsCardFlipped(false);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-content checkout-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="modal-close-btn" onClick={handleClose} aria-label="Close checkout">
          <X size={20} />
        </button>

        {/* Step Indicator Top Progress Bar */}
        <div className="checkout-progress-bar">
          <div className={`step-dot ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <span>1</span>
            <label>Shipping</label>
          </div>
          <div className="progress-line"><div className="line-fill" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div></div>
          <div className={`step-dot ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <span>2</span>
            <label>Payment</label>
          </div>
          <div className="progress-line"><div className="line-fill" style={{ width: step <= 2 ? '0%' : '100%' }}></div></div>
          <div className={`step-dot ${step >= 3 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <span>3</span>
            <label>Confirmation</label>
          </div>
        </div>

        {/* Step 1: Shipping Form details */}
        {step === 1 && (
          <div className="checkout-step-container">
            <h2 className="step-heading">Shipping Information</h2>
            <form onSubmit={handleShippingSubmit} className="checkout-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={shippingForm.name}
                  onChange={handleShippingChange}
                  className={`form-input ${shippingErrors.name ? 'error' : ''}`}
                  placeholder="Charlotte Dubois"
                />
                {shippingErrors.name && <span className="input-err">{shippingErrors.name}</span>}
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={shippingForm.email}
                  onChange={handleShippingChange}
                  className={`form-input ${shippingErrors.email ? 'error' : ''}`}
                  placeholder="charlotte@zyvora.com"
                />
                {shippingErrors.email && <span className="input-err">{shippingErrors.email}</span>}
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={shippingForm.address}
                  onChange={handleShippingChange}
                  className={`form-input ${shippingErrors.address ? 'error' : ''}`}
                  placeholder="14 Rue du Faubourg Saint-Honoré"
                />
                {shippingErrors.address && <span className="input-err">{shippingErrors.address}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingForm.city}
                    onChange={handleShippingChange}
                    className={`form-input ${shippingErrors.city ? 'error' : ''}`}
                    placeholder="Paris"
                  />
                  {shippingErrors.city && <span className="input-err">{shippingErrors.city}</span>}
                </div>

                <div className="form-group">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    name="zip"
                    value={shippingForm.zip}
                    onChange={handleShippingChange}
                    className={`form-input ${shippingErrors.zip ? 'error' : ''}`}
                    placeholder="75008"
                  />
                  {shippingErrors.zip && <span className="input-err">{shippingErrors.zip}</span>}
                </div>
              </div>

              <div className="checkout-footer-row">
                <button type="submit" className="btn-primary continue-btn">
                  Continue to Payment <ChevronRight size={16} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Payment Gateway + Flipped visual card preview */}
        {step === 2 && (
          <div className="checkout-step-container">
            <h2 className="step-heading">Secure Payment</h2>
            
            <div className="payment-layout">
              {/* Left Column: Form */}
              <form onSubmit={handlePaymentSubmit} className="checkout-form payment-form-element">
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentForm.cardNumber}
                    onChange={handlePaymentChange}
                    onFocus={() => setIsCardFlipped(false)}
                    className={`form-input ${paymentErrors.cardNumber ? 'error' : ''}`}
                    placeholder="4000 1234 5678 9010"
                  />
                  {paymentErrors.cardNumber && <span className="input-err">{paymentErrors.cardNumber}</span>}
                </div>

                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    name="cardName"
                    value={paymentForm.cardName}
                    onChange={handlePaymentChange}
                    onFocus={() => setIsCardFlipped(false)}
                    className={`form-input ${paymentErrors.cardName ? 'error' : ''}`}
                    placeholder="CHARLOTTE DUBOIS"
                  />
                  {paymentErrors.cardName && <span className="input-err">{paymentErrors.cardName}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Expiration Date</label>
                    <input
                      type="text"
                      name="cardExpiry"
                      value={paymentForm.cardExpiry}
                      onChange={handlePaymentChange}
                      onFocus={() => setIsCardFlipped(false)}
                      className={`form-input ${paymentErrors.cardExpiry ? 'error' : ''}`}
                      placeholder="MM/YY"
                    />
                    {paymentErrors.cardExpiry && <span className="input-err">{paymentErrors.cardExpiry}</span>}
                  </div>

                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="password"
                      name="cardCvv"
                      value={paymentForm.cardCvv}
                      onChange={handlePaymentChange}
                      onFocus={() => setIsCardFlipped(true)}
                      onBlur={() => setIsCardFlipped(false)}
                      className={`form-input ${paymentErrors.cardCvv ? 'error' : ''}`}
                      placeholder="•••"
                    />
                    {paymentErrors.cardCvv && <span className="input-err">{paymentErrors.cardCvv}</span>}
                  </div>
                </div>

                <div className="security-guarantee">
                  <Lock size={12} />
                  <span>Your payment details are encrypted. Transaction total: <strong>${total.toFixed(2)}</strong></span>
                </div>

                <div className="checkout-footer-row">
                  <button type="submit" className="btn-primary continue-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing payment...' : `Pay $${total.toFixed(2)}`}
                  </button>
                </div>
              </form>

              {/* Right Column: Visual Credit Card Simulation */}
              <div className="payment-visualizer-column">
                <div className={`credit-card-canvas ${isCardFlipped ? 'flipped' : ''}`}>
                  {/* Card Front face */}
                  <div className="card-face card-front">
                    <div className="card-glow"></div>
                    <div className="card-top-header">
                      <span className="card-network-label">ZYVORA ELITE</span>
                      <div className="card-emv-chip"></div>
                    </div>
                    
                    <div className="card-number-display">
                      {paymentForm.cardNumber || '•••• •••• •••• ••••'}
                    </div>
                    
                    <div className="card-bottom-row">
                      <div className="card-holder-info">
                        <span className="visual-card-sub">Card Holder</span>
                        <span className="visual-card-name">
                          {paymentForm.cardName.toUpperCase() || 'CHARLOTTE DUBOIS'}
                        </span>
                      </div>
                      
                      <div className="card-expiry-info">
                        <span className="visual-card-sub">Expires</span>
                        <span className="visual-card-date">{paymentForm.cardExpiry || 'MM/YY'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Back face */}
                  <div className="card-face card-back">
                    <div className="card-magnetic-strip"></div>
                    <div className="card-sig-cvv-row">
                      <div className="card-signature-panel"></div>
                      <div className="card-cvv-panel">
                        {paymentForm.cardCvv || '•••'}
                      </div>
                    </div>
                    <div className="card-back-text">
                      Unauthorized use is subject to prosecution. Powered by ZYVORA Bank.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Success Confirmation details */}
        {step === 3 && (
          <div className="checkout-step-container success-step-container">
            <div className="success-icon-wrapper">
              <CheckCircle2 size={64} className="success-icon" />
            </div>
            
            <h2 className="success-heading">Order Confirmed</h2>
            <span className="order-number-tag">Order ID: <strong>{orderNumber}</strong></span>
            
            <p className="success-description">
              Thank you for shopping at ZYVORA, <strong>{shippingForm.name}</strong>. A receipt and shipping tracking links will be sent to <strong>{shippingForm.email}</strong> shortly.
            </p>

            <div className="order-summary-details">
              <span className="summary-section-title">Delivery details</span>
              <p className="delivery-address">
                {shippingForm.address} <br />
                {shippingForm.city}, {shippingForm.zip}
              </p>
            </div>

            <button className="btn-primary order-completed-close-btn" onClick={handleClose}>
              Back to Catalog
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
