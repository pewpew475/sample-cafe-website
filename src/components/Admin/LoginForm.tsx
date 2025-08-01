'use client';

import React, { useState } from 'react';
import authService from '../../services/auth';
import { AdminUser } from '../../services/auth';

interface LoginFormProps {
  setAuthenticated: (authenticated: boolean) => void;
  setCurrentUser: (user: AdminUser | null) => void;
}

function LoginForm({ setAuthenticated, setCurrentUser }: LoginFormProps) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await authService.signIn(credentials.email, credentials.password);

      if (result.success) {
        setAuthenticated(true);
        const user = authService.getCurrentAdminUser();
        setCurrentUser(user);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="admin@samplecafe.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Enter your password"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <div className="firebase-info">
          <p><strong>🔐 Secure Firebase Authentication</strong></p>
          <p>Admin credentials are now stored securely in Firebase.</p>
          <p>Contact your administrator for login credentials.</p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
