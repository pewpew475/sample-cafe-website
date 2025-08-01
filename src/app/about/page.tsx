'use client';

import React from 'react';
import './about.css';

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>About Sample Cafe</h1>
          <p>Where passion meets flavor, and every meal tells a story</p>
        </div>
        <div className="hero-image">
          <div className="placeholder-image">🏪</div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="our-story">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <h2>Our Story</h2>
              <p>
                Founded in 2020, Sample Cafe began as a dream to create a warm, welcoming space 
                where friends and families could gather over exceptional food and coffee. What started 
                as a small neighborhood cafe has grown into a beloved community hub.
              </p>
              <p>
                Our journey is rooted in the belief that great food brings people together. Every 
                recipe is crafted with care, using locally sourced ingredients and time-honored 
                techniques passed down through generations.
              </p>
              <p>
                Today, we continue to serve our community with the same passion and dedication 
                that inspired our founding, creating memorable experiences one meal at a time.
              </p>
            </div>
            <div className="story-image">
              <div className="placeholder-image">👨‍🍳</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🌱</div>
              <h3>Fresh & Local</h3>
              <p>We source our ingredients from local farms and suppliers, ensuring freshness and supporting our community.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">❤️</div>
              <h3>Made with Love</h3>
              <p>Every dish is prepared with passion and attention to detail, creating flavors that warm the heart.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Community First</h3>
              <p>We believe in building connections and creating a space where everyone feels welcome and valued.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">♻️</div>
              <h3>Sustainable</h3>
              <p>We&apos;re committed to environmentally responsible practices and reducing our ecological footprint.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">👨‍🍳</div>
              <h3>Chef Marco</h3>
              <p>Head Chef</p>
              <p>With 15 years of culinary experience, Chef Marco brings creativity and expertise to every dish.</p>
            </div>
            <div className="team-member">
              <div className="member-image">👩‍💼</div>
              <h3>Sarah Johnson</h3>
              <p>Manager</p>
              <p>Sarah ensures every guest has an exceptional experience with her warm hospitality and attention to detail.</p>
            </div>
            <div className="team-member">
              <div className="member-image">👨‍🍳</div>
              <h3>Alex Chen</h3>
              <p>Sous Chef</p>
              <p>Alex&apos;s innovative approach to traditional recipes adds a modern twist to our classic favorites.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p>
              To create exceptional dining experiences that bring people together, 
              support our local community, and celebrate the art of great food. 
              We strive to be more than just a cafe – we aim to be a place where 
              memories are made and friendships flourish.
            </p>
            <div className="mission-stats">
              <div className="stat">
                <h3>5000+</h3>
                <p>Happy Customers</p>
              </div>
              <div className="stat">
                <h3>50+</h3>
                <p>Menu Items</p>
              </div>
              <div className="stat">
                <h3>3+</h3>
                <p>Years Serving</p>
              </div>
              <div className="stat">
                <h3>100%</h3>
                <p>Fresh Ingredients</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
