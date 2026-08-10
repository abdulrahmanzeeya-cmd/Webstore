import React from 'react';
import { ArrowRight } from 'lucide-react';
import './Hero.css';

export default function Hero({ onExploreClick }) {
  return (
    <section className="hero-section">
      <div className="hero-grid container">
        {/* Hero Text content */}
        <div className="hero-content">
          <span className="hero-subtitle">L'ÉLÉGANCE INTEMPORELLE</span>
          <h2 className="hero-title">
            The Autumn <br />
            <span>Editorial</span>
          </h2>
          <p className="hero-description">
            Discover a sophisticated collection of fluid silhouettes, organic silk trenches, and handcrafted accessories. Tailored with meticulous care for the modern editorial wardrobe.
          </p>
          <div className="hero-actions-row">
            <button className="btn-primary hero-btn" onClick={onExploreClick}>
              Explore Collection <ArrowRight size={16} className="arrow-icon" />
            </button>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-num">01/</span>
                <span className="stat-label">Organic Silk</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">02/</span>
                <span className="stat-label">Italian Leather</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image Showcase */}
        <div className="hero-showcase">
          <div className="hero-image-wrapper">
            <img 
              src="/hero_model.png" 
              alt="ZYVORA Luxury Editorial Model" 
              className="hero-image"
            />
            <div className="hero-image-card">
              <span className="card-label">Featured Outerwear</span>
              <span className="card-title">Elixir Silk Trench</span>
              <span className="card-price">$320</span>
            </div>
          </div>
          <div className="hero-accent-block"></div>
        </div>
      </div>
    </section>
  );
}
