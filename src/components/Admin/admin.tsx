'use client';

import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { AdminUser } from '../../services/auth';

import OrdersManagement from '../Admin/OrdersManagement';
import ProductManagement from '../Admin/ProductManagement';
import SettingsPanel from '../Admin/SettingsPanel';
import LoginForm from '../Admin/LoginForm';
import AdminSetup from '../Admin/AdminSetup';
import authService from '../../services/auth';
import './admin.css';

type AdminTab = 'orders' | 'products' | 'settings';

function Admin() {
  const { logout } = useRestaurant();
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [firebaseError, setFirebaseError] = useState<boolean>(false);
  const [needsSetup, setNeedsSetup] = useState<boolean>(false);
  const [isCheckingSetup, setIsCheckingSetup] = useState<boolean>(true);

  // Check Firebase authentication status on component mount
  useEffect(() => {
    const checkAuthAndSetup = async () => {
      try {
        // Check if admin setup is enabled in environment
        const adminSetupEnabled = process.env.NEXT_PUBLIC_ENABLE_ADMIN_SETUP === 'true';

        // Check if Firebase is properly configured and user is authenticated
        const firebaseAuth = authService.isAuthenticated();
        const firebaseUser = authService.getCurrentAdminUser();

        if (firebaseAuth && firebaseUser) {
          setAuthenticated(true);
          setCurrentUser(firebaseUser);
          setNeedsSetup(false);
          setFirebaseError(false);
        } else {
          setAuthenticated(false);
          setCurrentUser(null);

          // Only allow setup if environment variable allows it
          if (adminSetupEnabled) {
            // Check if we need to show setup (when no admin has ever been created)
            try {
              const adminExists = await authService.checkAdminExists();
              setNeedsSetup(!adminExists);
              setFirebaseError(false);
            } catch (error) {
              // If Firebase check fails, check if setup was already completed
              console.warn('Firebase check failed:', error);
              const setupCompleted = localStorage.getItem('admin_setup_completed') === 'true';
              setNeedsSetup(!setupCompleted);
              setFirebaseError(!setupCompleted); // Only show Firebase error if setup wasn't completed
            }
          } else {
            // Admin setup is disabled in production - only show login
            setNeedsSetup(false);
            setFirebaseError(false);
          }
        }
      } catch (error) {
        console.warn('Auth check failed:', error);
        setFirebaseError(true);
        // Only allow setup if environment variable allows it
        const adminSetupEnabled = process.env.NEXT_PUBLIC_ENABLE_ADMIN_SETUP === 'true';
        setNeedsSetup(adminSetupEnabled);
        setAuthenticated(false);
        setCurrentUser(null);
      } finally {
        setIsCheckingSetup(false);
      }
    };

    checkAuthAndSetup();
  }, []); // Empty dependency array to run only once on mount

  const handleLogout = async () => {
    await logout();
    setAuthenticated(false);
    setCurrentUser(null);
  };

  const handleSetupComplete = () => {
    // Mark setup as completed and update state
    localStorage.setItem('admin_setup_completed', 'true');
    setNeedsSetup(false);
    setFirebaseError(false);
    setIsCheckingSetup(false);
    // The AdminSetup component already sets authentication state
    // No need to reload the page
  };

  // Debug logging
  console.log('Admin component render:', {
    authenticated,
    firebaseError,
    currentUser,
    needsSetup,
    isCheckingSetup
  });

  // Show loading while checking setup requirements
  if (isCheckingSetup) {
    return (
      <div className="admin-container">
        <div className="admin-loading">
          <h2>Loading Admin Panel...</h2>
          <p>Checking authentication status...</p>
        </div>
      </div>
    );
  }

  // Show setup form ONLY if no admin has ever been created AND setup is enabled
  const adminSetupEnabled = process.env.NEXT_PUBLIC_ENABLE_ADMIN_SETUP === 'true';
  if (needsSetup && !localStorage.getItem('admin_setup_completed') && adminSetupEnabled) {
    return (
      <div className="admin-container">
        <div className="admin-setup-container">
          <h2>Admin Setup Required</h2>
          <p>Welcome! Please create your admin account to get started.</p>
          <AdminSetup
            onSetupComplete={handleSetupComplete}
            setAuthenticated={setAuthenticated}
            setCurrentUser={setCurrentUser}
          />
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!authenticated) {
    // If setup is needed but disabled, show an error message
    if (needsSetup && !adminSetupEnabled) {
      return (
        <div className="admin-container">
          <div className="admin-error">
            <h2>⚠️ Admin Setup Required</h2>
            <p>No admin account has been created yet, but admin setup is disabled in production.</p>
            <p>To resolve this issue:</p>
            <ol>
              <li>Set <code>NEXT_PUBLIC_ENABLE_ADMIN_SETUP=true</code> in your Vercel environment variables</li>
              <li>Redeploy your application</li>
              <li>Visit this page to create your admin account</li>
              <li>Set <code>NEXT_PUBLIC_ENABLE_ADMIN_SETUP=false</code> after setup is complete</li>
              <li>Redeploy again to secure your application</li>
            </ol>
            <p><strong>Contact your developer if you need assistance.</strong></p>
          </div>
        </div>
      );
    }

    return <LoginForm setAuthenticated={setAuthenticated} setCurrentUser={setCurrentUser} />;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Restaurant Admin Dashboard</h1>
        <div className="admin-user-info">
          {currentUser && (
            <span className="user-welcome">
              Welcome, {currentUser.username} ({currentUser.email})
            </span>
          )}
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders Management
        </button>
        <button
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Product Management
        </button>
        <button
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'orders' && <OrdersManagement />}
        {activeTab === 'products' && <ProductManagement />}
        {activeTab === 'settings' && <SettingsPanel />}
      </div>
    </div>
  );
}

export default Admin;