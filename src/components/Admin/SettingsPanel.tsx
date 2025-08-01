'use client';

import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { RestaurantSettings, AdminUser } from '../../types';

function SettingsPanel() {
  const { 
    settings, 
    updateSettings, 
    adminUser, 
    updateAdminCredentials 
  } = useRestaurant();
  
  const [activeSection, setActiveSection] = useState<'restaurant' | 'admin' | 'currency'>('restaurant');
  const [restaurantForm, setRestaurantForm] = useState<RestaurantSettings>(settings);
  const [adminForm, setAdminForm] = useState<AdminUser & { confirmPassword: string }>({
    username: adminUser.username,
    password: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' }
  ];

  const handleRestaurantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    try {
      await updateSettings(restaurantForm);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (adminForm.password !== adminForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (adminForm.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setSaveStatus('saving');
    try {
      await updateAdminCredentials({
        username: adminForm.username,
        password: adminForm.password
      });
      setSaveStatus('saved');
      setAdminForm({
        username: adminForm.username,
        password: '',
        confirmPassword: ''
      });
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const handleRestaurantChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRestaurantForm({
      ...restaurantForm,
      [name]: name === 'taxRate' || name === 'serviceCharge' 
        ? parseFloat(value) || 0 
        : value
    });
  };

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminForm({
      ...adminForm,
      [name]: value
    });
  };

  const handleCurrencyChange = async (currencyCode: string) => {
    setSaveStatus('saving');
    try {
      await updateSettings({ currency: currencyCode });
      setRestaurantForm({ ...restaurantForm, currency: currencyCode });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  return (
    <div className="settings-panel">
      <div className="section-tabs">
        <button
          className={`section-tab ${activeSection === 'restaurant' ? 'active' : ''}`}
          onClick={() => setActiveSection('restaurant')}
        >
          Restaurant Details
        </button>
        <button
          className={`section-tab ${activeSection === 'admin' ? 'active' : ''}`}
          onClick={() => setActiveSection('admin')}
        >
          Admin Account
        </button>
        <button
          className={`section-tab ${activeSection === 'currency' ? 'active' : ''}`}
          onClick={() => setActiveSection('currency')}
        >
          Currency & Pricing
        </button>
      </div>

      {saveStatus !== 'idle' && (
        <div className={`save-status ${saveStatus}`}>
          {saveStatus === 'saving' && 'Saving...'}
          {saveStatus === 'saved' && 'Settings saved successfully!'}
          {saveStatus === 'error' && 'Error saving settings. Please try again.'}
        </div>
      )}

      {activeSection === 'restaurant' && (
        <div className="restaurant-settings">
          <h3>Restaurant Information</h3>
          <form onSubmit={handleRestaurantSubmit} className="settings-form">
            <div className="form-group">
              <label htmlFor="name">Restaurant Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={restaurantForm.name}
                onChange={handleRestaurantChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address:</label>
              <textarea
                id="address"
                name="address"
                value={restaurantForm.address}
                onChange={handleRestaurantChange}
                rows={3}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={restaurantForm.phone}
                onChange={handleRestaurantChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={restaurantForm.email}
                onChange={handleRestaurantChange}
                required
              />
            </div>

            <button type="submit" className="save-btn" disabled={saveStatus === 'saving'}>
              Save Restaurant Details
            </button>
          </form>
        </div>
      )}

      {activeSection === 'admin' && (
        <div className="admin-settings">
          <h3>Admin Account Settings</h3>
          <form onSubmit={handleAdminSubmit} className="settings-form">
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={adminForm.username}
                onChange={handleAdminChange}
                required
                minLength={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">New Password:</label>
              <input
                type={showPasswords ? 'text' : 'password'}
                id="password"
                name="password"
                value={adminForm.password}
                onChange={handleAdminChange}
                required
                minLength={6}
                placeholder="Enter new password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type={showPasswords ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={adminForm.confirmPassword}
                onChange={handleAdminChange}
                required
                minLength={6}
                placeholder="Confirm new password"
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={showPasswords}
                  onChange={(e) => setShowPasswords(e.target.checked)}
                />
                Show passwords
              </label>
            </div>

            <button type="submit" className="save-btn" disabled={saveStatus === 'saving'}>
              Update Admin Credentials
            </button>
          </form>

          <div className="security-note">
            <h4>Security Note:</h4>
            <p>
              Make sure to use a strong password and keep your credentials secure. 
              You will need to log in again after changing your password.
            </p>
          </div>
        </div>
      )}

      {activeSection === 'currency' && (
        <div className="currency-settings">
          <h3>Currency & Pricing Settings</h3>
          
          <div className="currency-selection">
            <h4>Select Currency</h4>
            <div className="currency-grid">
              {currencies.map(currency => (
                <div
                  key={currency.code}
                  className={`currency-option ${settings.currency === currency.code ? 'selected' : ''}`}
                  onClick={() => handleCurrencyChange(currency.code)}
                >
                  <span className="currency-symbol">{currency.symbol}</span>
                  <span className="currency-code">{currency.code}</span>
                  <span className="currency-name">{currency.name}</span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleRestaurantSubmit} className="pricing-form">
            <h4>Additional Charges</h4>
            
            <div className="form-group">
              <label htmlFor="taxRate">Tax Rate (%):</label>
              <input
                type="number"
                id="taxRate"
                name="taxRate"
                value={restaurantForm.taxRate * 100}
                onChange={(e) => setRestaurantForm({
                  ...restaurantForm,
                  taxRate: parseFloat(e.target.value) / 100 || 0
                })}
                step="0.01"
                min="0"
                max="100"
              />
              <small>Current: {(restaurantForm.taxRate * 100).toFixed(2)}%</small>
            </div>

            <div className="form-group">
              <label htmlFor="serviceCharge">Service Charge (%):</label>
              <input
                type="number"
                id="serviceCharge"
                name="serviceCharge"
                value={restaurantForm.serviceCharge * 100}
                onChange={(e) => setRestaurantForm({
                  ...restaurantForm,
                  serviceCharge: parseFloat(e.target.value) / 100 || 0
                })}
                step="0.01"
                min="0"
                max="100"
              />
              <small>Current: {(restaurantForm.serviceCharge * 100).toFixed(2)}%</small>
            </div>

            <button type="submit" className="save-btn" disabled={saveStatus === 'saving'}>
              Save Pricing Settings
            </button>
          </form>

          <div className="pricing-preview">
            <h4>Pricing Preview</h4>
            <div className="preview-calculation">
              <div className="preview-line">
                <span>Sample Item Price:</span>
                <span>{new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: settings.currency
                }).format(10.00)}</span>
              </div>
              <div className="preview-line">
                <span>Tax ({(restaurantForm.taxRate * 100).toFixed(2)}%):</span>
                <span>{new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: settings.currency
                }).format(10.00 * restaurantForm.taxRate)}</span>
              </div>
              <div className="preview-line">
                <span>Service Charge ({(restaurantForm.serviceCharge * 100).toFixed(2)}%):</span>
                <span>{new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: settings.currency
                }).format(10.00 * restaurantForm.serviceCharge)}</span>
              </div>
              <div className="preview-line total">
                <span><strong>Total:</strong></span>
                <span><strong>{new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: settings.currency
                }).format(10.00 * (1 + restaurantForm.taxRate + restaurantForm.serviceCharge))}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsPanel;
