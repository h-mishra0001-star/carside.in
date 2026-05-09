import React, { useEffect, useState, useCallback, useRef } from 'react';
import api from '../services/api';
import CarCard from '../components/CarCard';

function NewReleases() {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    brand: 'all',
    minPrice: '',
    maxPrice: '',
    sort: 'newest'
  });
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const hasFetched = useRef(false);
  const isFiltering = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchData();
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!loading && cars.length > 0 && !isFiltering.current) {
      isFiltering.current = true;
      applyFilters();
      isFiltering.current = false;
    }
  }, [filters, cars, loading]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [carsRes, brandsRes] = await Promise.all([
        api.get('/cars?newOnly=true'),
        api.get('/brands')
      ]);
      
      // Ensure data is always an array
      const carsData = Array.isArray(carsRes.data) ? carsRes.data : [];
      const brandsData = Array.isArray(brandsRes.data) ? brandsRes.data : [];
      
      setCars(carsData);
      setFilteredCars(carsData);
      setBrands(brandsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load cars. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    // Ensure cars is an array
    let result = Array.isArray(cars) ? [...cars] : [];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(car => 
        car.modelName?.toLowerCase().includes(searchLower) ||
        car.brandId?.name?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.brand !== 'all') {
      result = result.filter(car => car.brandId?.name === filters.brand);
    }

    if (filters.minPrice) {
      const minPrice = parseFloat(filters.minPrice);
      if (!isNaN(minPrice)) {
        result = result.filter(car => (car.price || 0) >= minPrice);
      }
    }
    if (filters.maxPrice) {
      const maxPrice = parseFloat(filters.maxPrice);
      if (!isNaN(maxPrice)) {
        result = result.filter(car => (car.price || 0) <= maxPrice);
      }
    }

    switch (filters.sort) {
      case 'price_asc':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price_desc':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'hp_desc':
        result.sort((a, b) => (b.horsepower || 0) - (a.horsepower || 0));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredCars(result);
    setCurrentPage(1);
  }, [cars, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      brand: 'all',
      minPrice: '',
      maxPrice: '',
      sort: 'newest'
    });
  };

  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const paginatedCars = filteredCars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (error) {
    return (
      <div className="error-state">
        <i className="fas fa-exclamation-triangle"></i>
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button className="btn-primary" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>New Release Cars</h1>
          <p>Discover the latest automotive masterpieces hitting the roads</p>
        </div>
      </section>

      <section className="filter-section">
        <div className="container">
          <div className="filter-bar">
            <div className="search-wrapper">
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Search cars or brands..." 
                className="search-input"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            
            <select 
              className="filter-select"
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
            >
              <option value="all">🏭 All Brands</option>
              {brands.map(brand => (
                <option key={brand._id} value={brand.name}>{brand.name}</option>
              ))}
            </select>
            
            <div className="price-filters">
              <input 
                type="number" 
                placeholder="Min $" 
                className="price-input"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
              <span>-</span>
              <input 
                type="number" 
                placeholder="Max $" 
                className="price-input"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>
            
            <select 
              className="filter-select"
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
            >
              <option value="newest">📅 Newest First</option>
              <option value="price_asc">💰 Price: Low to High</option>
              <option value="price_desc">💰 Price: High to Low</option>
              <option value="hp_desc">⚡ Horsepower: High to Low</option>
            </select>
            
            <button className="btn-primary" onClick={applyFilters}>
              <i className="fas fa-filter"></i> Apply
            </button>
            <button className="btn-outline" onClick={resetFilters}>
              <i className="fas fa-undo"></i> Reset
            </button>
            
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <i className="fas fa-th"></i>
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="results-info">
            <p>
              <i className="fas fa-flag-checkered"></i> 
              Showing <strong>{paginatedCars.length}</strong> of <strong>{filteredCars.length}</strong> cars
            </p>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loader"></div>
              <p>Loading vehicles...</p>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="no-results">
              <i className="fas fa-search"></i>
              <h3>No cars found</h3>
              <p>Try adjusting your filters or search criteria</p>
              <button className="btn-outline" onClick={resetFilters}>
                <i className="fas fa-undo"></i> Clear Filters
              </button>
            </div>
          ) : (
            <div className={`cars-container ${viewMode}`}>
              {paginatedCars.map(car => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              
              {[...Array(Math.min(totalPages, 5)).keys()].map(i => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button 
                    key={pageNum}
                    className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="page-dots">...</span>
              )}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <button 
                  className="page-btn"
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </button>
              )}
              
              <button 
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default NewReleases;