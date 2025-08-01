'use client';

import React from 'react';
import Link from 'next/link';
import { useRestaurant } from '../../context/RestaurantContext';
import './footer.css';

export default function Footer() {
  const { settings } = useRestaurant();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            {/* Company Info */}
            <div className="footer-section">
              <h3 className="footer-title">{settings.name}</h3>
              <p className="footer-description">
                Where passion meets flavor, and every meal tells a story. 
                Join us for an unforgettable dining experience.
              </p>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Facebook">
                  <span className="social-icon">📘</span>
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <span className="social-icon">📷</span>
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <span className="social-icon">🐦</span>
                </a>
                <a href="#" className="social-link" aria-label="YouTube">
                  <span className="social-icon">📺</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h4 className="footer-subtitle">Quick Links</h4>
              <ul className="footer-links">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/cart">Cart</Link></li>
                <li><Link href="#menu">Menu</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div className="footer-section">
              <h4 className="footer-subtitle">Services</h4>
              <ul className="footer-links">
                <li><a href="#dine-in">Dine In</a></li>
                <li><a href="#takeaway">Takeaway</a></li>
                <li><a href="#catering">Catering</a></li>
                <li><a href="#events">Private Events</a></li>
                <li><a href="#delivery">Delivery</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-section">
              <h4 className="footer-subtitle">Contact Info</h4>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <span className="contact-text">{settings.address}</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <span className="contact-text">{settings.phone}</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  <span className="contact-text">{settings.email}</span>
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="footer-section">
              <h4 className="footer-subtitle">Opening Hours</h4>
              <div className="hours-list">
                <div className="hour-item">
                  <span className="day">Mon - Fri</span>
                  <span className="time">7:00 AM - 9:00 PM</span>
                </div>
                <div className="hour-item">
                  <span className="day">Saturday</span>
                  <span className="time">8:00 AM - 10:00 PM</span>
                </div>
                <div className="hour-item">
                  <span className="day">Sunday</span>
                  <span className="time">8:00 AM - 8:00 PM</span>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="footer-section newsletter-section">
              <h4 className="footer-subtitle">Stay Updated</h4>
              <p className="newsletter-text">
                Subscribe to our newsletter for special offers and updates.
              </p>
              <form className="newsletter-form">
                <div className="newsletter-input-group">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="newsletter-input"
                    required
                  />
                  <button type="submit" className="newsletter-btn">
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; {currentYear} {settings.name}. All rights reserved.</p>
            </div>
            <div className="footer-bottom-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#cookies">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
