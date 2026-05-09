import React, { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import BrandCard from '../components/BrandCard';

function Brands() {
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedSort, setSelectedSort] = useState('name');
  const hasFetched = useRef(false);

  // Fetch brands - ONLY ONCE
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchBrands();
    }
    window.scrollTo(0, 0);
  }, []);

  // Apply filters - ONLY when search/filter/sort changes
  useEffect(() => {
    if (!loading && brands.length > 0) {
      filterAndSortBrands();
    }
  }, [searchTerm, selectedCountry, selectedSort]);

  const fetchBrands = async () => {
    try {
      const response = await api.get('/brands');
      const brandsData = Array.isArray(response.data) ? response.data : [];
      setBrands(brandsData);
      setFilteredBrands(brandsData);
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortBrands = () => {
    let result = [...brands];
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(brand => 
        brand.name?.toLowerCase().includes(searchLower) ||
        brand.country?.toLowerCase().includes(searchLower) ||
        brand.description?.toLowerCase().includes(searchLower)
      );
    }
    
    if (selectedCountry !== 'all') {
      result = result.filter(brand => brand.country === selectedCountry);
    }
    
    switch (selectedSort) {
      case 'name':
        result.sort((a, b) => a.name?.localeCompare(b.name));
        break;
      case 'name_desc':
        result.sort((a, b) => b.name?.localeCompare(a.name));
        break;
      case 'popularity':
        result.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      default:
        result.sort((a, b) => a.name?.localeCompare(b.name));
    }
    
    setFilteredBrands(result);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCountry('all');
    setSelectedSort('name');
  };

  const countries = [...new Set(brands.map(b => b.country).filter(Boolean))];

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loader"></div>
        <p>Loading brands...</p>
      </div>
    );
  }

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Automotive Brands</h1>
          <p>Explore the world's finest car manufacturers</p>
        </div>
      </section>

      <section className="filter-section">
        <div className="container">
          <div className="filter-bar">
            <div className="search-wrapper">
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Search by brand name or country..." 
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select 
              className="filter-select"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="all">🌍 All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            <select 
              className="filter-select"
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
            >
              <option value="name">Sort: Name A-Z</option>
              <option value="name_desc">Sort: Name Z-A</option>
              <option value="popularity">Sort: Most Popular</option>
            </select>
            
            <button className="btn-outline" onClick={resetFilters}>
              <i className="fas fa-undo"></i> Reset
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {filteredBrands.length === 0 ? (
            <div className="no-results">
              <i className="fas fa-search"></i>
              <h3>No brands found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <button className="btn-primary" onClick={resetFilters} style={{ marginTop: '20px' }}>
                <i className="fas fa-undo"></i> Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="results-info">
                <p>
                  <i className="fas fa-flag-checkered"></i> Showing 
                  <strong> {filteredBrands.length} </strong> 
                  {filteredBrands.length === 1 ? 'brand' : 'brands'}
                </p>
              </div>
              <div className="brands-grid">
                {filteredBrands.map(brand => (
                  <BrandCard key={brand._id} brand={brand} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default Brands;