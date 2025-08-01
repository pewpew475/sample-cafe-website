'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRestaurant } from '../../context/RestaurantContext';
import { useNotification } from '../../context/NotificationContext';
import './cart.css';

export default function CartPage() {
  const {
    cart,
    updateCartItem,
    removeFromCart,
    clearCart,
    createOrder,
    settings
  } = useRestaurant();
  const { showSuccess, showError } = useNotification();
  
  const [tableNumber, setTableNumber] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: settings.currency
    }).format(amount);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartItem(productId, newQuantity);
    }
  };

  const handleCreateOrder = async () => {
    if (!tableNumber.trim()) {
      showError('Please enter a table number');
      return;
    }

    setIsOrdering(true);
    try {
      await createOrder(tableNumber);
      setOrderSuccess(true);
      setTableNumber('');
      showSuccess('Your order has been placed successfully! 🎉');
      setTimeout(() => setOrderSuccess(false), 3000);
    } catch (error) {
      showError('Failed to create order. Please try again.');
    } finally {
      setIsOrdering(false);
    }
  };

  const subtotal = cart.total;
  const tax = subtotal * settings.taxRate;
  const serviceCharge = subtotal * settings.serviceCharge;
  const total = subtotal + tax + serviceCharge;

  if (cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <h1>Your Cart</h1>
          <div className="empty-cart">
            <div style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', marginBottom: 'clamp(15px, 3vw, 25px)' }}>🛒</div>
            <h3 style={{
              color: '#2c3e50',
              marginBottom: 'clamp(10px, 2vw, 15px)',
              fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
              fontWeight: '600'
            }}>Your cart is empty</h3>
            <p>Discover our delicious menu items and add them to your cart to get started!</p>
            <Link href="/" className="continue-shopping-btn">
              🍽️ Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1>Your Cart</h1>
        
        {orderSuccess && (
          <div className="order-success">
            Order placed successfully! Your order is being prepared.
          </div>
        )}

        <div className="cart-content">
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.productId} className="cart-item">
                <div className="item-info">
                  <h3>{item.product.name}</h3>
                  <p>{item.product.description}</p>
                  <p className="item-price">{formatCurrency(item.product.price)}</p>
                </div>
                
                <div className="item-controls">
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                      className="quantity-btn"
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
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            
            <div className="summary-line">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            
            <div className="summary-line">
              <span>Tax ({(settings.taxRate * 100).toFixed(1)}%):</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            
            <div className="summary-line">
              <span>Service Charge ({(settings.serviceCharge * 100).toFixed(1)}%):</span>
              <span>{formatCurrency(serviceCharge)}</span>
            </div>
            
            <div className="summary-line total">
              <span>Total:</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <div className="order-form">
              <div className="form-group">
                <label htmlFor="tableNumber">Table Number:</label>
                <input
                  type="text"
                  id="tableNumber"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="Enter table number"
                  required
                />
              </div>

              <div className="cart-actions">
                <button
                  onClick={clearCart}
                  className="clear-cart-btn"
                >
                  Clear Cart
                </button>
                
                <button
                  onClick={handleCreateOrder}
                  disabled={isOrdering || !tableNumber.trim()}
                  className="place-order-btn"
                >
                  {isOrdering ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
