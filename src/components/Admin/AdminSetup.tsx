'use client';

import React, { useState } from 'react';
import authService from '../../services/auth';
import { AdminUser } from '../../services/auth';

interface AdminSetupProps {
  onSetupComplete: () => void;
  setAuthenticated: (authenticated: boolean) => void;
  setCurrentUser: (user: AdminUser | null) => void;
}

function AdminSetup({
  onSetupComplete,
  setAuthenticated,
  setCurrentUser
}: AdminSetupProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: 'admin'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      const result = await authService.createAdmin({
        email: formData.email,
        password: formData.password,
        username: formData.username
      });

      if (result.success) {
        // Set authentication state
        setAuthenticated(true);
        const user = authService.getCurrentAdminUser();
        setCurrentUser(user);
        onSetupComplete();
      } else {
        setError(result.error || 'Failed to create admin account');
      }
    } catch (error) {
      console.error('Setup error:', error);
      setError('An unexpected error occurred during setup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>🚀 Admin Setup</h2>
        <p style={{ marginBottom: '1.5rem', color: '#666', textAlign: 'center' }}>
          Create your first admin account to get started
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Admin Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="admin@samplecafe.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="admin"
              minLength={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Enter a secure password"
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Confirm your password"
              minLength={6}
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Admin Account'}
          </button>
        </form>

        <div className="firebase-info">
          <p><strong>🔐 Secure Setup</strong></p>
          <p>Your admin credentials will be securely stored in Firebase.</p>
          <p>Make sure to use a strong password and keep your credentials safe.</p>
        </div>
      </div>
    </div>
  );
}

export default AdminSetup;
