'use client';

import React, { useState, useMemo } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useNotification } from '../../context/NotificationContext';
import { Product } from '../../types';

import './products.css';

function Products() {
  const { products, categories, addToCart, updateCartItem, removeFromCart, cart, settings } = useRestaurant();
  const { showSuccess } = useNotification();
  const [selectedCategory, setSelectedCategory] = useState<string>('All Items');
  const [showAllCategories, setShowAllCategories] = useState<boolean>(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: settings.currency
    }).format(amount);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    showSuccess(`${product.name} added to cart!`);
  };

  const handleIncreaseQuantity = (product: Product) => {
    const cartItem = cart.items.find(item => item.productId === product.id);
    if (cartItem) {
      updateCartItem(product.id, cartItem.quantity + 1);
    } else {
      addToCart(product, 1);
    }
  };

  const handleDecreaseQuantity = (product: Product) => {
    const cartItem = cart.items.find(item => item.productId === product.id);
    if (cartItem) {
      if (cartItem.quantity > 1) {
        updateCartItem(product.id, cartItem.quantity - 1);
      } else {
        removeFromCart(product.id);
      }
    }
  };

  const getCartQuantity = (productId: string): number => {
    const cartItem = cart.items.find(item => item.productId === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Filter products by category and availability
  const filteredProducts = useMemo(() => {
    const availableProducts = products.filter(p => p.available);
    if (selectedCategory === 'All Items') {
      return availableProducts;
    }
    return availableProducts.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  // Get categories for filtering (limit to 5 initially)
  const displayCategories = useMemo(() => {
    const allCategories = ['All Items', ...categories.filter(c => c.name !== 'All Items').map(c => c.name)];
    return showAllCategories ? allCategories : allCategories.slice(0, 5);
  }, [categories, showAllCategories]);

  const hasMoreCategories = categories.length > 4; // 4 because we exclude 'All Items'

  return (
    <div className="products-container">
      <div className="products-header">
        <h2>Our Menu</h2>
        <p>Discover our delicious selection of fresh, quality dishes</p>
      </div>

      {/* Category Filters */}
      <div className="products-controls">
        <div className="category-filters">
          {displayCategories.map(category => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
          {hasMoreCategories && !showAllCategories && (
            <button
              className="filter-btn view-more"
              onClick={() => setShowAllCategories(true)}
            >
              View More +
            </button>
          )}
          {showAllCategories && hasMoreCategories && (
            <button
              className="filter-btn view-less"
              onClick={() => setShowAllCategories(false)}
            >
              View Less -
            </button>
          )}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <h3>No products available</h3>
          <p>
            {selectedCategory === 'All Items'
              ? 'No products are currently available. Please check back later!'
              : `No products available in "${selectedCategory}" category.`
            }
          </p>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image-content"
                      onError={(e) => {
                        console.error('Image failed to load:', product.image);
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`placeholder-image ${product.image ? 'hidden' : ''}`}>
                    <span>🍽️</span>
                  </div>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-category-tag">{product.category}</div>
                  <div className="product-price">{formatCurrency(product.price)}</div>
                </div>
                <div className="product-actions">
                  {getCartQuantity(product.id) === 0 ? (
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="add-to-cart-btn"
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <div className="quantity-controls">
                      <button
                        onClick={() => handleDecreaseQuantity(product)}
                        className="quantity-btn minus"
                      >
                        -
                      </button>
                      <span className="quantity-display">
                        {getCartQuantity(product.id)}
                      </span>
                      <button
                        onClick={() => handleIncreaseQuantity(product)}
                        className="quantity-btn plus"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="products-summary">
            <p>Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
               {selectedCategory !== 'All Items' && ` in "${selectedCategory}"`}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default Products;