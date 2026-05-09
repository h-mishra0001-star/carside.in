import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import CarCard from '../components/CarCard';

function BrandDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brand, setBrand] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    fetchBrandDetail();
    checkFollowStatus();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchBrandDetail = async () => {
    try {
      const response = await api.get(`/brands/${id}`);
      setBrand(response.data.brand);
      setCars(response.data.cars || []);
    } catch (error) {
      console.error('Error fetching brand:', error);
      setShowMessage(true);
      setMessageText('Failed to load brand details');
      setTimeout(() => setShowMessage(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = () => {
    const following = JSON.parse(localStorage.getItem('followingBrands') || '[]');
    setIsFollowing(following.includes(id));
  };

  const showNotification = (message, isSuccess = true) => {
    setMessageText(message);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const toggleFollow = () => {
    const following = JSON.parse(localStorage.getItem('followingBrands') || '[]');
    if (isFollowing) {
      const newFollowing = following.filter(f => f !== id);
      localStorage.setItem('followingBrands', JSON.stringify(newFollowing));
      setIsFollowing(false);
      showNotification(`You have unfollowed ${brand?.name}`, true);
    } else {
      following.push(id);
      localStorage.setItem('followingBrands', JSON.stringify(following));
      setIsFollowing(true);
      showNotification(`You are now following ${brand?.name}!`, true);
    }
  };

  const handleWebsiteClick = () => {
    if (brand?.website && brand.website !== 'www.example.com') {
      window.open(brand.website, '_blank');
    } else {
      showNotification('Website link not available', false);
    }
  };

  const filteredCars = filter === 'all' ? cars : cars.filter(car => car.isNewRelease);

  const brandInfo = [
    { icon: 'fas fa-calendar-alt', label: 'Founded', value: brand?.foundedYear || 'N/A', color: '#b9d024' },
    { icon: 'fas fa-map-marker-alt', label: 'Country', value: brand?.country || 'Global', color: '#b9d024' },
    { icon: 'fas fa-car', label: 'Models', value: `${cars.length}+`, color: '#b9d024' },
    { icon: 'fas fa-globe', label: 'Website', value: brand?.website ? 'Visit Site' : 'N/A', color: '#b9d024', onClick: handleWebsiteClick }
  ];

  const highlights = [
    { text: 'Industry Leader in Innovation', icon: 'fa-microchip' },
    { text: 'Award-Winning Designs', icon: 'fa-trophy' },
    { text: 'Sustainable Manufacturing', icon: 'fa-leaf' },
    { text: 'Global Presence in 50+ Countries', icon: 'fa-globe-asia' }
  ];

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loader"></div>
        <p>Loading brand details...</p>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="no-results">
        <i className="fas fa-exclamation-triangle"></i>
        <h3>Brand not found</h3>
        <p>The brand you're looking for doesn't exist or has been removed.</p>
        <button className="btn-primary" onClick={() => navigate('/brands')} style={{ marginTop: '20px' }}>
          <i className="fas fa-arrow-left"></i> Back to Brands
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Notification Toast */}
      {showMessage && (
        <div className="notification-toast">
          <i className={`fas ${messageText.includes('unfollowed') ? 'fa-heart-broken' : 'fa-heart'}`}></i>
          {messageText}
        </div>
      )}

      {/* Brand Hero */}
      <section className="brand-hero">
        <div className="brand-hero-bg">
          <div className="brand-hero-overlay"></div>
        </div>
        <div className="container">
          <div className="brand-hero-content">
            <div className="brand-logo-large">
              <img src={brand.logoUrl} alt={brand.name} />
            </div>
            <h1>{brand.name}</h1>
            <p className="brand-tagline">{brand.tagline || 'Excellence in Automotive Engineering'}</p>
            <div className="brand-actions">
              <button className={`btn-${isFollowing ? 'outline' : 'primary'}`} onClick={toggleFollow}>
                <i className={`fas ${isFollowing ? 'fa-check' : 'fa-heart'}`}></i>
                {isFollowing ? ' Following' : ' Follow Brand'}
              </button>
              <button className="btn-outline" onClick={() => navigate('/compare')}>
                <i className="fas fa-chart-line"></i> Compare Models
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Info Section */}
      <section className="brand-info-section">
        <div className="container">
          <div className="brand-info-grid">
            <div className="brand-description">
              <h2>About {brand.name}</h2>
              <p>{brand.description || `${brand.name} is a renowned automotive manufacturer known for quality, innovation, and performance. With decades of excellence, they continue to set benchmarks in the automotive industry.`}</p>
              <div className="brand-stats-grid">
                {brandInfo.map((info, idx) => (
                  <div key={idx} className="brand-stat" onClick={info.onClick} style={{ cursor: info.onClick ? 'pointer' : 'default' }}>
                    <i className={info.icon} style={{ color: info.color }}></i>
                    <div>
                      <label>{info.label}</label>
                      <span>{info.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="brand-highlights">
              <h3><i className="fas fa-star"></i> Key Highlights</h3>
              <ul>
                {highlights.map((highlight, idx) => (
                  <li key={idx}>
                    <i className={`fas ${highlight.icon}`} style={{ color: '#b9d024' }}></i>
                    {highlight.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Models Section */}
      <section className="models-section">
        <div className="container">
          <div className="section-header">
            <h2><i className="fas fa-car"></i> Available Models</h2>
            <p>Explore the complete lineup of {brand.name} vehicles</p>
            <div className="model-filters">
              <button 
                className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                <i className="fas fa-car"></i> All Models ({cars.length})
              </button>
              <button 
                className={`filter-chip ${filter === 'new' ? 'active' : ''}`}
                onClick={() => setFilter('new')}
              >
                <i className="fas fa-fire"></i> New Releases ({cars.filter(c => c.isNewRelease).length})
              </button>
            </div>
          </div>
          
          {filteredCars.length === 0 ? (
            <div className="no-results">
              <i className="fas fa-search"></i>
              <h3>No models found</h3>
              <p>Check back later for new releases from {brand.name}</p>
            </div>
          ) : (
            <div className="releases-grid">
              {filteredCars.map(car => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Similar Brands Section */}
      <section className="similar-brands">
        <div className="container">
          <div className="section-header">
            <h2><i className="fas fa-trademark"></i> You May Also Like</h2>
            <p>Explore similar premium brands</p>
          </div>
          <div className="similar-brands-grid">
            {['BMW', 'Mercedes-Benz', 'Audi'].map(brandName => (
              <div key={brandName} className="similar-brand-card" onClick={() => navigate(`/brand/${brandName.toLowerCase()}`)}>
                <i className="fas fa-building"></i>
                <h4>{brandName}</h4>
                <p>Luxury German Automaker</p>
                <span className="explore-link">Explore <i className="fas fa-arrow-right"></i></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add CSS for notification toast */}
      <style jsx>{`
        .notification-toast {
          position: fixed;
          top: 100px;
          right: 20px;
          background: #b9d024;
          color: #090909;
          padding: 12px 24px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 1000;
          animation: slideIn 0.3s ease;
          font-weight: 500;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default BrandDetail;