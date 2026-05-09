import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BrandCard({ brand }) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    navigate(`/brand/${brand._id}`);
  };

  const handleExploreClick = (e) => {
    e.stopPropagation();
    navigate(`/brand/${brand._id}`);
  };

  const fallbackImage = 'https://ui-avatars.com/api/?background=b9d024&color=fff&bold=true&name=' + brand.name?.charAt(0) || 'C';

  return (
    <div 
      className="brand-card" 
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'all 0.3s ease'
      }}
    >
      <div className="brand-logo">
        <img 
          src={imageError ? fallbackImage : brand.logoUrl} 
          alt={brand.name} 
          loading="lazy"
          onError={() => setImageError(true)}
        />
      </div>
      
      <h3>{brand.name}</h3>
      <p>{brand.description?.substring(0, 80)}...</p>
      
      <div className="brand-stats">
        <span className="brand-stat-item">
          <i className="fas fa-calendar-alt"></i> 
          {brand.foundedYear || 'N/A'}
        </span>
        <span className="brand-stat-item">
          <i className="fas fa-map-marker-alt"></i> 
          {brand.country || 'Global'}
        </span>
      </div>
      
      <div className="brand-models">
        <i className="fas fa-car"></i> 
        <span className="models-count">{brand.carsCount || 0}</span> 
        Models Available
      </div>
      
      <button className={`btn-${isHovered ? 'primary' : 'outline'} btn-small`} onClick={handleExploreClick}>
        Explore Models 
        <i className={`fas fa-arrow-${isHovered ? 'right' : 'right'}`}></i>
      </button>

      {/* Popularity Badge */}
      {brand.popularity > 90 && (
        <div className="popularity-badge">
          <i className="fas fa-fire"></i> Popular
        </div>
      )}
    </div>
  );
}

export default BrandCard;