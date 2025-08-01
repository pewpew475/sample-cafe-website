'use client';

import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useNotification } from '../../context/NotificationContext';
import { Order, OrderStatus, OrderFilters } from '../../types';

function OrdersManagement() {
  const { orders, updateOrderStatus, getFilteredOrders, settings, clearOrderHistory } = useRestaurant();
  const { showSuccess, showError } = useNotification();
  const [activeSection, setActiveSection] = useState<'queue' | 'history'>('queue');
  const [filters, setFilters] = useState<OrderFilters>({});
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    orderId: string;
    status: OrderStatus;
  } | null>(null);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const [clearPassword, setClearPassword] = useState('');

  const pendingOrders = orders.filter(order => order.status === OrderStatus.PENDING);
  const filteredOrders = getFilteredOrders(filters);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setPendingStatusChange({ orderId, status: newStatus });
    setShowConfirmation(true);
  };

  const confirmStatusChange = async () => {
    if (pendingStatusChange) {
      await updateOrderStatus(pendingStatusChange.orderId, pendingStatusChange.status);
      setShowConfirmation(false);
      setPendingStatusChange(null);
    }
  };

  const cancelStatusChange = () => {
    setShowConfirmation(false);
    setPendingStatusChange(null);
  };

  const handleClearOrderHistory = () => {
    setShowClearConfirmation(true);
  };

  const confirmClearOrderHistory = async () => {
    // For now, we'll use a simple password check
    // In a real app, this should be more secure
    if (clearPassword === 'admin123') {
      await clearOrderHistory();
      setShowClearConfirmation(false);
      setClearPassword('');
      showSuccess('Order history cleared successfully! Order numbering reset to 1.');
    } else {
      showError('Incorrect password! Please try again.');
    }
  };

  const cancelClearOrderHistory = () => {
    setShowClearConfirmation(false);
    setClearPassword('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: settings.currency
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return '#ff9800';
      case OrderStatus.COMPLETED:
        return '#4caf50';
      case OrderStatus.CANCELLED:
        return '#f44336';
      default:
        return '#757575';
    }
  };

  return (
    <div className="orders-management">
      <div className="section-tabs">
        <button
          className={`section-tab ${activeSection === 'queue' ? 'active' : ''}`}
          onClick={() => setActiveSection('queue')}
        >
          Orders Queue ({pendingOrders.length})
        </button>
        <button
          className={`section-tab ${activeSection === 'history' ? 'active' : ''}`}
          onClick={() => setActiveSection('history')}
        >
          Order History
        </button>
      </div>

      {activeSection === 'queue' && (
        <div className="orders-queue">
          <h3>Current Pending Orders</h3>
          {pendingOrders.length === 0 ? (
            <p className="no-orders">No pending orders</p>
          ) : (
            <div className="orders-grid">
              {pendingOrders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <span className="order-id">#{order.orderNumber}</span>
                    <span className="table-number">Table {order.tableNumber}</span>
                    <span 
                      className="order-status"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="order-time">
                    {formatDate(order.createdAt)}
                  </div>
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <span>{item.quantity}x {item.product.name}</span>
                        <span>{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-total">
                    <strong>Total: {formatCurrency(order.total)}</strong>
                  </div>
                  <div className="order-actions">
                    <button
                      onClick={() => handleStatusChange(order.id, OrderStatus.COMPLETED)}
                      className="complete-btn"
                    >
                      Mark Complete
                    </button>
                    <button
                      onClick={() => handleStatusChange(order.id, OrderStatus.CANCELLED)}
                      className="cancel-btn"
                    >
                      Cancel Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSection === 'history' && (
        <div className="orders-history">
          <div className="history-header">
            <h3>Order History</h3>
            <button
              onClick={handleClearOrderHistory}
              className="clear-history-btn danger-btn"
            >
              Clear Order History
            </button>
          </div>
          <div className="filters">
            <div className="filter-group">
              <label>Status:</label>
              <select
                value={filters.status || ''}
                onChange={(e) => setFilters({
                  ...filters,
                  status: e.target.value as OrderStatus || undefined
                })}
              >
                <option value="">All Statuses</option>
                <option value={OrderStatus.PENDING}>Pending</option>
                <option value={OrderStatus.COMPLETED}>Completed</option>
                <option value={OrderStatus.CANCELLED}>Cancelled</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Date:</label>
              <input
                type="date"
                value={filters.date ? new Date(filters.date).toISOString().split('T')[0] : ''}
                onChange={(e) => setFilters({
                  ...filters,
                  date: e.target.value ? new Date(e.target.value) : undefined
                })}
              />
            </div>
            <div className="filter-group">
              <label>Table Number:</label>
              <input
                type="text"
                placeholder="Search table..."
                value={filters.tableNumber || ''}
                onChange={(e) => setFilters({
                  ...filters,
                  tableNumber: e.target.value || undefined
                })}
              />
            </div>
            <div className="filter-group">
              <label>Order ID:</label>
              <input
                type="text"
                placeholder="Search order ID..."
                value={filters.orderId || ''}
                onChange={(e) => setFilters({
                  ...filters,
                  orderId: e.target.value || undefined
                })}
              />
            </div>
            <button
              onClick={() => setFilters({})}
              className="clear-filters-btn"
            >
              Clear Filters
            </button>
          </div>
          
          <div className="orders-table">
            {filteredOrders.length === 0 ? (
              <p className="no-orders">No orders found</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Table</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td>#{order.orderNumber}</td>
                      <td>{order.tableNumber}</td>
                      <td>{order.items.length} items</td>
                      <td>{formatCurrency(order.total)}</td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="view-btn"
                        >
                          View Details
                        </button>
                        {order.status === OrderStatus.PENDING && (
                          <>
                            <button
                              onClick={() => handleStatusChange(order.id, OrderStatus.COMPLETED)}
                              className="complete-btn small"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => handleStatusChange(order.id, OrderStatus.CANCELLED)}
                              className="cancel-btn small"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order Details - #{selectedOrder.id.slice(-6)}</h3>
              <button onClick={() => setSelectedOrder(null)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <div className="order-info">
                <p><strong>Table:</strong> {selectedOrder.tableNumber}</p>
                <p><strong>Status:</strong> {selectedOrder.status}</p>
                <p><strong>Created:</strong> {formatDate(selectedOrder.createdAt)}</p>
                <p><strong>Updated:</strong> {formatDate(selectedOrder.updatedAt)}</p>
              </div>
              <div className="order-items-detail">
                <h4>Items:</h4>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="item-detail">
                    <span>{item.quantity}x {item.product.name}</span>
                    <span>{formatCurrency(item.price)} each</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="order-total-detail">
                <strong>Total: {formatCurrency(selectedOrder.total)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && pendingStatusChange && (
        <div className="modal-overlay">
          <div className="modal-content confirmation-modal">
            <div className="modal-header">
              <h3>Confirm Status Change</h3>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to change the order status to{' '}
                <strong>{pendingStatusChange.status}</strong>?
              </p>
            </div>
            <div className="modal-actions">
              <button onClick={confirmStatusChange} className="confirm-btn">
                Confirm
              </button>
              <button onClick={cancelStatusChange} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Order History Confirmation Modal */}
      {showClearConfirmation && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>⚠️ Clear Order History</h3>
            <p>
              This action will permanently delete ALL order history and reset the order numbering to 1.
              This cannot be undone!
            </p>
            <div className="password-input">
              <label>Enter admin password to confirm:</label>
              <input
                type="password"
                value={clearPassword}
                onChange={(e) => setClearPassword(e.target.value)}
                placeholder="Enter password..."
                autoFocus
              />
              <small>Default password: admin123</small>
            </div>
            <div className="modal-actions">
              <button onClick={confirmClearOrderHistory} className="confirm-btn danger-btn">
                Clear All Orders
              </button>
              <button onClick={cancelClearOrderHistory} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersManagement;
