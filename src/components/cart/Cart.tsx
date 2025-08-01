'use client';

import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import CheckoutModal from './CheckoutModal';
import './cart.css';

function Cart() {
  const { 
    cart, 
    updateCartItem, 
    removeFromCart, 
    clearCart, 
    settings 
  } = useRestaurant();
  
  const [showCheckout, setShowCheckout] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: settings.currency
    }).format(amount);
  };

  const calculateSubtotal = () => {
    return cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * settings.taxRate;
  };

  const calculateServiceCharge = (subtotal: number) => {
    return subtotal * settings.serviceCharge;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const serviceCharge = calculateServiceCharge(subtotal);
    return subtotal + tax + serviceCharge;
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartItem(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handleCheckoutClose = () => {
    setShowCheckout(false);
  };

  if (cart.items.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-header">
          <h2>Your Cart</h2>
        </div>
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Discover our delicious menu items and add them to your cart to get started!</p>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const serviceCharge = calculateServiceCharge(subtotal);
  const total = calculateTotal();

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Your Cart ({cart.items.length} items)</h2>
        <button onClick={clearCart} className="clear-cart-btn">
          Clear Cart
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cart.items.map(item => (
            <div key={item.productId} className="cart-item">
              <div className="item-image">
                {item.product.image ? (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="cart-item-image"
                  />
                ) : (
                  <div className="placeholder-image">
                    <span>🍽️</span>
                  </div>
                )}
              </div>
              
              <div className="item-details">
                <h3 className="item-name">{item.product.name}</h3>
                <p className="item-description">{item.product.description}</p>
                <div className="item-category">{item.product.category}</div>
                <div className="item-price">{formatCurrency(item.product.price)}</div>
              </div>
              
              <div className="item-controls">
                <div className="quantity-controls">
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                    className="quantity-btn"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
                
                <div className="item-total">
                  {formatCurrency(item.product.price * item.quantity)}
                </div>
                
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="remove-btn"
                  title="Remove item"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-section">
            <h3>Order Summary</h3>
            
            <div className="summary-line">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            
            {settings.taxRate > 0 && (
              <div className="summary-line">
                <span>Tax ({(settings.taxRate * 100).toFixed(1)}%):</span>
                <span>{formatCurrency(tax)}</span>
              </div>
            )}
            
            {settings.serviceCharge > 0 && (
              <div className="summary-line">
                <span>Service Charge ({(settings.serviceCharge * 100).toFixed(1)}%):</span>
                <span>{formatCurrency(serviceCharge)}</span>
              </div>
            )}
            
            <div className="summary-line total">
              <span><strong>Total:</strong></span>
              <span><strong>{formatCurrency(total)}</strong></span>
            </div>
          </div>
          
          <div className="checkout-section">
            <button onClick={handleCheckout} className="checkout-btn">
              Order Now
            </button>
            <p className="checkout-note">
              You&apos;ll be asked for your table number before confirming the order.
            </p>
          </div>
        </div>
      </div>

      {showCheckout && (
        <CheckoutModal
          cart={cart}
          total={total}
          subtotal={subtotal}
          tax={tax}
          serviceCharge={serviceCharge}
          onClose={handleCheckoutClose}
          formatCurrency={formatCurrency}
        />
      )}
    </div>
  );
}

export default Cart;
