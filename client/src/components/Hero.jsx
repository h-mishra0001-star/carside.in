import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Hero() {
  const navigate = useNavigate();
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  const phrases = [
    'Has a Story',
    'Meets Power',
    'Defines You',
    'Is an Emotion'
  ];

  // Typing effect
  useEffect(() => {
    let typingTimeout;
    let cursorInterval;

    if (textIndex < phrases.length) {
      const currentPhrase = phrases[textIndex];
      let charIndex = 0;
      
      const typeNextChar = () => {
        if (charIndex <= currentPhrase.length) {
          setTypedText(currentPhrase.substring(0, charIndex));
          charIndex++;
          typingTimeout = setTimeout(typeNextChar, 100);
        } else {
          // Wait before moving to next phrase
          setTimeout(() => {
            setTextIndex(prev => (prev + 1) % phrases.length);
          }, 2000);
        }
      };
      
      typeNextChar();
    }
    
    // Blinking cursor
    cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearTimeout(typingTimeout);
      clearInterval(cursorInterval);
    };
  }, [textIndex]);

  const handleWatchTrailer = () => {
    setShowTrailerModal(true);
  };

  const handleCloseModal = () => {
    setShowTrailerModal(false);
  };

  const handleSocialClick = (platform) => {
    alert(`🔗 Follow us on ${platform} for exclusive content!`);
  };

  return (
    <>
      <section className="hero">
        <div className="hero-video-bg">
          <video autoPlay muted loop playsInline>
            <source src="https://assets.mixkit.co/videos/preview/mixkit-red-sports-car-on-the-road-1006-large.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <i className="fas fa-bolt"></i> 
            <span className="badge-text">Latest Update: 2026 Models Now Live</span>
          </div>
          
          <h1 className="hero-title">
            Every Car <span className="gradient-text">
              {typedText}
              <span className={`cursor ${showCursor ? 'visible' : 'hidden'}`}>|</span>
            </span>
          </h1>
          
          <p className="hero-subtitle">
            Discover, compare, and experience the finest automobiles from top brands worldwide.
          </p>
          
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate('/new-releases')}>
              <i className="fas fa-play"></i> Explore Now
            </button>
            <button className="btn-outline" onClick={handleWatchTrailer}>
              <i className="fas fa-video"></i> Watch Trailer
            </button>
          </div>
          
          <div className="connect-bar">
            <span>Connect with us:</span>
            <a href="#" onClick={(e) => { e.preventDefault(); handleSocialClick('Instagram'); }} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); handleSocialClick('Facebook'); }} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); handleSocialClick('Twitter'); }} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); handleSocialClick('YouTube'); }} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
          
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Car Models</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Top Brands</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">1M+</span>
              <span className="stat-label">Happy Users</span>
            </div>
          </div>
        </div>
        
        <div className="scroll-indicator" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
          <i className="fas fa-chevron-down"></i>
          <span className="scroll-text">Scroll</span>
        </div>
      </section>

      {/* Trailer Modal */}
      {showTrailerModal && (
        <div className="trailer-modal" onClick={handleCloseModal}>
          <div className="trailer-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>&times;</button>
            <div className="trailer-video">
              <iframe 
                width="100%" 
                height="400" 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                title="Trailer"
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="trailer-info">
              <h3>Carside.in - Ultimate Automotive Experience</h3>
              <p>Discover the world of luxury, performance, and innovation with Carside.in</p>
            </div>
          </div>
        </div>
      )}

      {/* CSS for enhancements */}
      <style jsx>{`
        .cursor {
          animation: blink 0.7s infinite;
          font-weight: normal;
        }
        .cursor.visible { opacity: 1; }
        .cursor.hidden { opacity: 0; }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-top: 40px;
          flex-wrap: wrap;
        }
        
        .hero-stat {
          text-align: center;
        }
        
        .stat-number {
          display: block;
          font-size: 1.5rem;
          font-weight: bold;
          color: #b9d024;
          font-family: 'Orbitron', monospace;
        }
        
        .stat-label {
          font-size: 0.75rem;
          color: var(--gray-100);
        }
        
        .scroll-text {
          display: block;
          font-size: 0.7rem;
          margin-top: 5px;
          color: white;
        }
        
        .badge-text {
          margin-left: 5px;
        }
        
        .hero-badge {
          display: inline-flex;
          align-items: center;
          background: rgba(185, 208, 36, 0.15);
          backdrop-filter: blur(10px);
          padding: 8px 20px;
          border-radius: 40px;
          border: 1px solid rgba(185, 208, 36, 0.3);
        }
        
        .trailer-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(10px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }
        
        .trailer-modal-content {
          max-width: 800px;
          width: 90%;
          background: #1a1a1a;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          animation: scaleIn 0.3s ease;
        }
        
        .modal-close {
          position: absolute;
          top: 10px;
          right: 15px;
          font-size: 1.5rem;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          z-index: 1;
        }
        
        .trailer-info {
          padding: 20px;
        }
        
        .trailer-info h3 {
          margin-bottom: 10px;
          color: #b9d024;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default Hero;