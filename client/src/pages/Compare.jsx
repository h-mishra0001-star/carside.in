import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ComparisonTable from '../components/ComparisonTable';
import EMICalculator from '../components/EMICalculator';

function Compare() {
  const [cars, setCars] = useState([]);
  const [selectedCar1, setSelectedCar1] = useState(null);
  const [selectedCar2, setSelectedCar2] = useState(null);
  const [showSelector, setShowSelector] = useState(false);
  const [selectorIndex, setSelectorIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    fetchCars();
    window.scrollTo(0, 0);
  }, []);

  const fetchCars = async () => {
    try {
      const response = await api.get('/cars');
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
      showToast('Failed to load cars. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setMessageText(message);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const openCarSelector = (index) => {
    if (cars.length === 0) {
      showToast('No cars available to compare', 'error');
      return;
    }
    setSelectorIndex(index);
    setShowSelector(true);
  };

  const selectCar = (car) => {
    if (selectorIndex === 0) {
      setSelectedCar1(car);
      showToast(`${car.modelName} added as Car 1`, 'success');
    } else {
      setSelectedCar2(car);
      showToast(`${car.modelName} added as Car 2`, 'success');
    }
    setShowSelector(false);
  };

  const swapCars = () => {
    if (!selectedCar1 || !selectedCar2) return;
    const temp = selectedCar1;
    setSelectedCar1(selectedCar2);
    setSelectedCar2(temp);
    showToast('Swapped cars', 'info');
  };

  const clearComparison = () => {
    setSelectedCar1(null);
    setSelectedCar2(null);
    showToast('Comparison cleared', 'info');
  };

  const printComparison = () => {
    window.print();
  };

  return (
    <>
      {/* Toast Notification */}
      {showMessage && (
        <div className={`toast-notification toast-${messageText.includes('added') ? 'success' : messageText.includes('Failed') ? 'error' : 'info'}`}>
          <i className={`fas ${messageText.includes('added') ? 'fa-check-circle' : messageText.includes('Failed') ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
          {messageText}
        </div>
      )}

      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>Compare Cars</h1>
          <p>Make informed decisions with side-by-side comparisons</p>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="section">
        <div className="container">
          {/* Car Selectors */}
          <div className="comparison-controls">
            {/* Car 1 Selector */}
            <div className="car-selector-card" onClick={() => openCarSelector(0)}>
              {selectedCar1 ? (
                <>
                  <img src={selectedCar1.imageUrl || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=100'} alt={selectedCar1.modelName} />
                  <div className="selector-info">
                    <h4>{selectedCar1.modelName}</h4>
                    <p>{selectedCar1.brandId?.name || 'Unknown Brand'}</p>
                    <span className="price">${selectedCar1.price?.toLocaleString()}</span>
                  </div>
                  <button className="change-btn" onClick={(e) => { e.stopPropagation(); openCarSelector(0); }}>
                    <i className="fas fa-edit"></i>
                  </button>
                </>
              ) : (
                <div className="add-car-placeholder">
                  <i className="fas fa-plus-circle"></i>
                  <span>Select Car 1</span>
                </div>
              )}
            </div>
            
            {/* VS Divider */}
            <div className="vs-container">
              <div className="vs-divider">VS</div>
              <button className="swap-btn" onClick={swapCars} disabled={!selectedCar1 || !selectedCar2} title="Swap cars">
                <i className="fas fa-exchange-alt"></i>
              </button>
            </div>
            
            {/* Car 2 Selector */}
            <div className="car-selector-card" onClick={() => openCarSelector(1)}>
              {selectedCar2 ? (
                <>
                  <img src={selectedCar2.imageUrl || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=100'} alt={selectedCar2.modelName} />
                  <div className="selector-info">
                    <h4>{selectedCar2.modelName}</h4>
                    <p>{selectedCar2.brandId?.name || 'Unknown Brand'}</p>
                    <span className="price">${selectedCar2.price?.toLocaleString()}</span>
                  </div>
                  <button className="change-btn" onClick={(e) => { e.stopPropagation(); openCarSelector(1); }}>
                    <i className="fas fa-edit"></i>
                  </button>
                </>
              ) : (
                <div className="add-car-placeholder">
                  <i className="fas fa-plus-circle"></i>
                  <span>Select Car 2</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {(selectedCar1 || selectedCar2) && (
            <div className="comparison-actions">
              <button className="btn-outline" onClick={clearComparison}>
                <i className="fas fa-trash-alt"></i> Clear All
              </button>
              <button className="btn-primary" onClick={printComparison}>
                <i className="fas fa-print"></i> Print Comparison
              </button>
            </div>
          )}

          {/* Comparison Table */}
          <ComparisonTable car1={selectedCar1} car2={selectedCar2} />

          {/* EMI Calculator */}
          <EMICalculator />
        </div>
      </section>

      {/* Car Selector Modal */}
      {showSelector && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-content modal-large">
            <span className="close" onClick={() => setShowSelector(false)}>&times;</span>
            <div className="modal-header">
              <i className="fas fa-car"></i>
              <h3>Select a Car to Compare</h3>
              <p>Choose from {cars.length} available cars</p>
            </div>
            
            {loading ? (
              <div className="loading-state">
                <div className="loader"></div>
                <p>Loading cars...</p>
              </div>
            ) : cars.length === 0 ? (
              <div className="no-results">
                <i className="fas fa-exclamation-triangle"></i>
                <p>No cars available. Please add cars to database.</p>
              </div>
            ) : (
              <div className="car-selector-grid">
                {cars.map(car => (
                  <div 
                    key={car._id} 
                    className={`selector-item ${(selectedCar1?._id === car._id || selectedCar2?._id === car._id) ? 'selected' : ''}`}
                    onClick={() => selectCar(car)}
                  >
                    <img src={car.imageUrl || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=80'} alt={car.modelName} />
                    <div className="selector-item-info">
                      <strong>{car.modelName}</strong>
                      <span className="brand">{car.brandId?.name || 'Unknown'}</span>
                      <span className="price">${car.price?.toLocaleString()}</span>
                    </div>
                    <div className="selector-item-specs">
                      <span><i className="fas fa-tachometer-alt"></i> {car.horsepower || 'N/A'} HP</span>
                      <span><i className="fas fa-stopwatch"></i> {car.acceleration || 'N/A'}</span>
                    </div>
                    {(selectedCar1?._id === car._id || selectedCar2?._id === car._id) && (
                      <div className="selected-badge">
                        <i className="fas fa-check"></i> Selected
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Toast CSS */}
      <style jsx>{`
        .toast-notification {
          position: fixed;
          top: 100px;
          right: 20px;
          background: #1a1a1a;
          color: #fff;
          padding: 12px 24px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 1000;
          animation: slideIn 0.3s ease;
          border-left: 4px solid #b9d024;
        }
        .toast-success { border-left-color: #00ff88; }
        .toast-error { border-left-color: #ff4444; }
        .toast-info { border-left-color: #00d4ff; }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .selector-item.selected {
          opacity: 0.6;
          background: rgba(185, 208, 36, 0.1);
          border: 1px solid #b9d024;
        }
        .selected-badge {
          background: #b9d024;
          color: #090909;
          padding: 4px 8px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: bold;
        }
      `}</style>
    </>
  );
}

export default Compare;