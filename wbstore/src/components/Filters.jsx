import React from 'react';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import './Filters.css';

export default function Filters({
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  inStockOnly,
  setInStockOnly,
  activeResultsCount
}) {
  const handlePriceChange = (e) => {
    setPriceRange(Number(e.target.value));
  };

  return (
    <section className="filters-section" id="products-catalog">
      <div className="filters-container container">
        {/* Filters Top Row: Info and Sort */}
        <div className="filters-top-bar">
          <div className="results-count">
            <span className="count-num">{activeResultsCount}</span>
            <span className="count-label">pieces curated</span>
          </div>

          <div className="filters-controls">
            {/* Sorting select */}
            <div className="control-group sort-group">
              <label htmlFor="sort-by" className="control-label">
                <ArrowUpDown size={14} className="control-icon" /> Sort:
              </label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="featured">Featured Collection</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filters Panel Row */}
        <div className="filters-panel">
          {/* Price Range and Stock filters */}
          <div className="filters-right-panel">
            {/* Price Slider */}
            <div className="filter-group price-group">
              <div className="price-label-row">
                <span className="group-title">Max Price</span>
                <span className="price-val">${priceRange}</span>
              </div>
              <input
                type="range"
                min="50"
                max="400"
                step="10"
                value={priceRange}
                onChange={handlePriceChange}
                className="price-slider"
              />
              <div className="slider-limits">
                <span>$50</span>
                <span>$400</span>
              </div>
            </div>

            {/* Checkbox for In Stock */}
            <div className="filter-group stock-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">In Stock Only</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
