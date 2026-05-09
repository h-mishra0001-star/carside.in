import React, { useState } from 'react';
import api from '../services/api';

function CarCard({ car, onRefresh }) {
  const [isBooking, setIsBooking] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showNotification = (message, isError = false) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleBook = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      showNotification('Please login first to book a test drive!', true);
      document.querySelector('.btn-login')?.click();
      return;
    }
    
    const date = prompt('Enter test drive date (YYYY-MM-DD):\nExample: 2025-12-31');
    if (!date) return;
    
    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      showNotification('Invalid date format. Use YYYY-MM-DD', true);
      return;
    }
    
    setIsBooking(true);
    try {
      await api.post('/bookings', {
        carId: car._id,
        testDriveDate: date
      });
      showNotification(`✅ Test drive booked for ${car.modelName} on ${date}!`);
      if (onRefresh) onRefresh();
    } catch (error) {
      showNotification('❌ Booking failed. Please try again.', true);
    } finally {
      setIsBooking(false);
    }
  };

  const handleQuickView = () => {
    showNotification(`
      🚗 ${car.modelName}
      📅 Year: ${car.year}
      💰 Price: $${car.price?.toLocaleString()}
      ⚡ Engine: ${car.engine || 'N/A'}
      💪 HP: ${car.horsepower}
      🚀 0-60: ${car.acceleration || 'N/A'}
      🏁 Top Speed: ${car.topSpeed || 'N/A'}
    `);
  };

  const handleVideo = () => {
    showNotification(`🎬 Playing video for ${car.modelName}`);
  };

  const fallbackImage = 'https://ui-avatars.com/api/?background=b9d024&color=fff&bold=true&name=' + car.modelName?.charAt(0) || 'C';

  const specs = [
    { icon: 'fa-tachometer-alt', label: `${car.horsepower || 'N/A'} HP`, color: '#b9d024' },
    { icon: 'fa-stopwatch', label: car.acceleration || 'N/A', color: '#b9d024' },
    { icon: 'fa-gauge-high', label: car.topSpeed || 'N/A', color: '#b9d024' },
    { icon: 'fa-gas-pump', label: car.fuelType || 'Petrol', color: '#b9d024' }
  ];

  const discount = car.oldPrice && car.oldPrice > car.price 
    ? Math.round(((car.oldPrice - car.price) / car.oldPrice) * 100) 
    : 0;

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div className="car-toast">
          <i className={`fas ${toastMessage.includes('✅') ? 'fa-check-circle' : toastMessage.includes('❌') ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
          {toastMessage}
        </div>
      )}

      <div 
        className="car-card"
        onMouseEnter={() => setShowDetails(true)}
        onMouseLeave={() => setShowDetails(false)}
      >
        <div className="car-image">
          <img 
            src={imageError ? fallbackImage : (car.imageUrl || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500')} 
            alt={car.modelName} 
            loading="lazy"
            onError={() => setImageError(true)}
          />
          {car.isNewRelease && <span className="new-badge">🔥 NEW</span>}
          {discount > 0 && <span className="discount-badge">-{discount}%</span>}
          <div className="car-overlay">
            <button className="btn-small" onClick={handleQuickView}>
              <i className="fas fa-eye"></i> Quick View
            </button>
          </div>
        </div>
        
        <div className="car-info">
          <div className="car-brand">
            <img 
              src={car.brandId?.logoUrl || fallbackImage} 
              alt={car.brandId?.name} 
              onError={(e) => { e.target.src = fallbackImage; }}
            />
            <span className="text-primary">{car.brandId?.name || 'Unknown'}</span>
          </div>
          
          <h3>{car.modelName} ({car.year})</h3>
          
          <div className="car-price">
            <span className="current-price">${car.price?.toLocaleString()}</span>
            {car.oldPrice && (
              <span className="old-price">${car.oldPrice.toLocaleString()}</span>
            )}
          </div>
          
          <div className="car-specs">
            {specs.map((spec, idx) => (
              <span key={idx} className="spec-item">
                <i className={`fas ${spec.icon}`} style={{ color: spec.color }}></i> 
                {spec.label}
              </span>
            ))}
          </div>
          
          <div className="car-buttons">
            <button className="btn-outline btn-small" onClick={handleVideo}>
              <i className="fas fa-play"></i> Video
            </button>
            <button 
              className="btn-primary btn-small" 
              onClick={handleBook}
              disabled={isBooking}
            >
              <i className="fas fa-calendar-check"></i> 
              {isBooking ? 'Booking...' : 'Book Test Drive'}
            </button>
          </div>
        </div>
        
        {showDetails && car.description && (
          <div className="car-details-tooltip">
            <div className="tooltip-content">
              <p><strong>🏎️ Engine:</strong> {car.engine || 'N/A'}</p>
              <p><strong>⚙️ Transmission:</strong> {car.transmission || 'Automatic'}</p>
              <p><strong>🔧 Drive Type:</strong> {car.driveType || 'AWD'}</p>
              <p><strong>⛽ Fuel Economy:</strong> {car.fuelEconomy || 'N/A'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Add CSS for Toast */}
      <style jsx>{`
        .car-toast {
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
          font-size: 0.9rem;
          max-width: 350px;
          white-space: pre-line;
        }
        .discount-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #ff4444;
          color: white;
          padding: 4px 8px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: bold;
          z-index: 1;
        }
        .spec-item {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          padding: 4px 8px;
          border-radius: 20px;
        }
        .current-price {
          font-size: 1.3rem;
          font-weight: bold;
          color: #b9d024;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default CarCard;