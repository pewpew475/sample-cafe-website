'use client';

import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useNotification } from '../../context/NotificationContext';
import { Cart, OrderStatus } from '../../types';

interface CheckoutModalProps {
  cart: Cart;
  total: number;
  subtotal: number;
  tax: number;
  serviceCharge: number;
  onClose: () => void;
  formatCurrency: (amount: number) => string;
}

function CheckoutModal({
  cart,
  total,
  subtotal,
  tax,
  serviceCharge,
  onClose,
  formatCurrency
}: CheckoutModalProps) {
  const { createOrder, clearCart, nextOrderNumber } = useRestaurant();
  const { showSuccess, showError } = useNotification();
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tableNumber.trim() || !customerName.trim()) {
      showError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createOrder(tableNumber);

      // Use the current order number (before increment)
      const orderNumber = nextOrderNumber;
      setOrderId(orderNumber.toString());
      setOrderPlaced(true);
      showSuccess(`Order #${orderNumber} has been placed successfully! 🎉`);
      // clearCart is called automatically by createOrder
    } catch (error) {
      showError('Failed to place order. Please try again.');
      console.error('Order placement error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (orderPlaced) {
      // Reset form state when closing after successful order
      setTableNumber('');
      setCustomerName('');
      setSpecialInstructions('');
      setOrderPlaced(false);
      setOrderId('');
    }
    onClose();
  };

  if (orderPlaced) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Order Confirmed!</h3>
            <button onClick={handleClose} className="close-btn">×</button>
          </div>
          
          <div className="modal-body">
            <div className="order-confirmation">
              <div className="success-icon">✅</div>
              <h4>Thank you for your order!</h4>
              <p><strong>Order ID:</strong> {orderId}</p>
              <p><strong>Table:</strong> {tableNumber}</p>
              <p><strong>Customer:</strong> {customerName}</p>
              <p><strong>Total:</strong> {formatCurrency(total)}</p>
              
              <div className="order-status">
                <p>Your order has been sent to the kitchen and will be prepared shortly.</p>
                <p>You can track your order status from the main menu.</p>
              </div>
            </div>
          </div>
          
          <div className="modal-actions">
            <button onClick={handleClose} className="confirm-btn">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Checkout</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="checkout-form">
              <div className="form-section">
                <h4>Order Details</h4>
                
                <div className="form-group">
                  <label htmlFor="tableNumber">Table Number *</label>
                  <input
                    type="number"
                    id="tableNumber"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    required
                    min="1"
                    max="100"
                    placeholder="Enter your table number"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="customerName">Customer Name *</label>
                  <input
                    type="text"
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    placeholder="Enter your name"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="specialInstructions">Special Instructions</label>
                  <textarea
                    id="specialInstructions"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    rows={3}
                    placeholder="Any special requests or dietary requirements..."
                  />
                </div>
              </div>
              
              <div className="order-review">
                <h4>Order Review</h4>
                
                <div className="review-items">
                  {cart.items.map(item => (
                    <div key={item.productId} className="review-item">
                      <span className="item-name">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="item-price">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="review-summary">
                  <div className="summary-line">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  
                  {tax > 0 && (
                    <div className="summary-line">
                      <span>Tax:</span>
                      <span>{formatCurrency(tax)}</span>
                    </div>
                  )}
                  
                  {serviceCharge > 0 && (
                    <div className="summary-line">
                      <span>Service Charge:</span>
                      <span>{formatCurrency(serviceCharge)}</span>
                    </div>
                  )}
                  
                  <div className="summary-line total">
                    <span><strong>Total:</strong></span>
                    <span><strong>{formatCurrency(total)}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button 
              type="submit" 
              className="confirm-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CheckoutModal;
