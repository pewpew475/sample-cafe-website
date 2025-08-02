'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useRestaurant } from '../../context/RestaurantContext';
import { Product, ProductFormData } from '../../types';
import { ImageUpload } from '../ImageUpload/ImageUpload';
import { UploadResult } from '@/hooks/useImageUpload';

function ProductManagement() {
  const { 
    products, 
    categories, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    addCategory, 
    deleteCategory,
    settings 
  } = useRestaurant();
  
  const [activeSection, setActiveSection] = useState<'add' | 'edit' | 'categories'>('add');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resetTrigger, setResetTrigger] = useState(0);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: undefined
  });

  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    });
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // For updates, use the uploaded image URL if available
        await updateProduct(editingProduct.id, {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          ...(uploadedImageUrl && { image: uploadedImageUrl })
        });
        setEditingProduct(null);
      } else {
        // For new products, use the uploaded image URL
        const productData = {
          ...formData,
          image: uploadedImageUrl || formData.image // Use uploaded URL or fallback to file
        };
        console.log('Saving new product with data:', productData);
        console.log('Image URL being saved:', productData.image);
        await addProduct(productData);
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: '',
        image: undefined
      });
      setUploadedImageUrl('');

      // Clear file input and trigger ImageUpload reset
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setResetTrigger(prev => prev + 1);

    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image
    });
    setUploadedImageUrl(product.image || '');
    setActiveSection('add');
  };

  const handleDelete = async (productId: string) => {
    await deleteProduct(productId);
    setShowDeleteConfirm(null);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      await addCategory({ name: newCategory.trim() });
      setNewCategory('');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    // Don't delete if products exist in this category
    const categoryName = categories.find(c => c.id === categoryId)?.name;
    const hasProducts = products.some(p => p.category === categoryName);
    
    if (hasProducts) {
      alert('Cannot delete category that contains products. Please move or delete products first.');
      return;
    }
    
    await deleteCategory(categoryId);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: settings.currency
    }).format(amount);
  };

  return (
    <div className="product-management">
      <div className="section-tabs">
        <button
          className={`section-tab ${activeSection === 'add' ? 'active' : ''}`}
          onClick={() => setActiveSection('add')}
        >
          {editingProduct ? 'Edit Product' : 'Add Product'}
        </button>
        <button
          className={`section-tab ${activeSection === 'edit' ? 'active' : ''}`}
          onClick={() => setActiveSection('edit')}
        >
          Manage Products
        </button>
        <button
          className={`section-tab ${activeSection === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveSection('categories')}
        >
          Categories
        </button>
      </div>

      {activeSection === 'add' && (
        <div className="add-product-section">
          <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group">
              <label htmlFor="name">Product Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price ({settings.currency}):</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category:</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                {categories.filter(cat => cat.name !== 'All Items').map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="image">Product Image:</label>
              <ImageUpload
                type="product"
                id={editingProduct?.id || 'new'}
                currentImage={uploadedImageUrl || editingProduct?.image}
                onUploadSuccess={(result: UploadResult) => {
                  console.log('Image upload successful:', result);
                  console.log('Image URL:', result.url);
                  setUploadedImageUrl(result.url);
                  setFormData({
                    ...formData,
                    image: undefined // Clear file since we now have URL
                  });
                }}
                onUploadError={(error: string) => {
                  console.error('Image upload failed:', error);
                  alert('Image upload failed: ' + error);
                }}
                placeholder="Upload product image"
                maxSize={3}
                resetTrigger={resetTrigger}
              />
              <small>Images are stored locally for fast delivery</small>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              {editingProduct && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setFormData({
                      name: '',
                      description: '',
                      price: 0,
                      category: '',
                      image: undefined
                    });
                  }}
                  className="cancel-btn"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {activeSection === 'edit' && (
        <div className="manage-products-section">
          <h3>Manage Products ({products.length})</h3>
          {products.length === 0 ? (
            <p className="no-products">No products available. Add some products to get started!</p>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image-container">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={300}
                        height={200}
                        className="product-image"
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                          console.error('Admin image failed to load:', product.image);
                          console.error('Error details:', e);
                        }}
                        onLoad={() => {
                          console.log('Admin image loaded successfully:', product.image);
                        }}
                      />
                    ) : (
                      <div className="product-placeholder">
                        <span>🍽️</span>
                        <p>No Image</p>
                      </div>
                    )}
                    <div className={`product-status-badge ${product.available ? 'available' : 'unavailable'}`}>
                      {product.available ? '✅ Available' : '❌ Unavailable'}
                    </div>
                  </div>
                  <div className="product-info">
                    <h4 className="product-name">{product.name}</h4>
                    <p className="product-description">{product.description}</p>
                    <div className="product-meta">
                      <span className="product-category-tag">{product.category}</span>
                      <span className="product-price">{formatCurrency(product.price)}</span>
                    </div>
                  </div>
                  <div className="product-actions">
                    <button
                      onClick={() => handleEdit(product)}
                      className="edit-btn"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => updateProduct(product.id, { available: !product.available })}
                      className={`toggle-btn ${product.available ? 'disable' : 'enable'}`}
                    >
                      {product.available ? '🚫 Disable' : '✅ Enable'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(product.id)}
                      className="delete-btn"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSection === 'categories' && (
        <div className="categories-section">
          <h3>Manage Categories</h3>
          
          <div className="add-category">
            <h4>Add New Category</h4>
            <form onSubmit={handleAddCategory} className="category-form">
              <div className="form-group">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Category name"
                  required
                />
                <button type="submit" className="add-btn">Add Category</button>
              </div>
            </form>
          </div>

          <div className="categories-list">
            <h4>Existing Categories</h4>
            {categories.map(category => {
              const productCount = products.filter(p => p.category === category.name).length;
              return (
                <div key={category.id} className="category-item">
                  <div className="category-info">
                    <span className="category-name">{category.name}</span>
                    <span className="product-count">({productCount} products)</span>
                  </div>
                  {category.name !== 'All Items' && (
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="delete-category-btn"
                      disabled={productCount > 0}
                    >
                      Delete
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content confirmation-modal">
            <div className="modal-header">
              <h3>Confirm Delete</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this product? This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="confirm-btn"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManagement;
