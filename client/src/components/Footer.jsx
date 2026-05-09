import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      showNotification('Please enter your email address');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showNotification('Please enter a valid email address');
      return;
    }
    
    setSubscribed(true);
    showNotification(`✅ Subscribed! You'll receive updates at ${email}`);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };
  
  const quickLinks = [
    { path: '/', label: '🏠 Home', icon: 'fas fa-home' },
    { path: '/new-releases', label: '🆕 New Releases', icon: 'fas fa-car' },
    { path: '/brands', label: '🏭 Brands', icon: 'fas fa-trademark' },
    { path: '/compare', label: '⚖️ Compare Cars', icon: 'fas fa-chart-line' },
    { path: '/about', label: '📖 About Us', icon: 'fas fa-info-circle' }
  ];
  
  const socialLinks = [
    { icon: 'fab fa-instagram', url: 'https://instagram.com/carside_in', label: 'Instagram', color: '#E4405F' },
    { icon: 'fab fa-facebook-f', url: 'https://facebook.com/carside.in', label: 'Facebook', color: '#1877F2' },
    { icon: 'fab fa-twitter', url: 'https://twitter.com/carside_in', label: 'Twitter', color: '#1DA1F2' },
    { icon: 'fab fa-youtube', url: 'https://youtube.com/c/carsidein', label: 'YouTube', color: '#FF0000' },
    { icon: 'fab fa-linkedin-in', url: 'https://linkedin.com/company/carside-in', label: 'LinkedIn', color: '#0077B5' }
  ];

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div className="footer-toast">
          <i className={`fas ${toastMessage.includes('✅') ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          {toastMessage}
        </div>
      )}

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            {/* Brand Section */}
            <div className="footer-section">
              <h3>
                <i className="fas fa-car-side"></i> 
                CARSIDE<span>.in</span>
              </h3>
              <p className="footer-description">
                Your ultimate destination for automotive excellence. Discover, compare, 
                and drive your dream car with confidence.
              </p>
              <div className="footer-contact">
                <p>
                  <i className="fas fa-envelope"></i> 
                  <a href="mailto:info@carside.in">info@carside.in</a>
                </p>
                <p>
                  <i className="fas fa-phone-alt"></i> 
                  <a href="tel:+919876543210">+91 98765 43210</a>
                </p>
                <p>
                  <i className="fas fa-map-marker-alt"></i> 
                  Mumbai, India
                </p>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                {quickLinks.map(link => (
                  <li key={link.path}>
                    <Link to={link.path}>
                      <i className={link.icon}></i> {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Social & Newsletter */}
            <div className="footer-section">
              <h4>Connect With Us</h4>
              <div className="social-links">
                {socialLinks.map(social => (
                  <a 
                    key={social.label}
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="social-link"
                    style={{ '--social-color': social.color }}
                  >
                    <i className={social.icon}></i>
                  </a>
                ))}
              </div>
              
              <div className="newsletter">
                <h4>
                  <i className="fas fa-envelope-open-text"></i> 
                  Subscribe to Newsletter
                </h4>
                <form onSubmit={handleSubscribe} className="newsletter-form">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={subscribed}
                  />
                  <button 
                    type="submit" 
                    className="btn-primary btn-small"
                    disabled={subscribed}
                  >
                    {subscribed ? <i className="fas fa-check"></i> : <i className="fas fa-paper-plane"></i>}
                    {subscribed ? ' Subscribed!' : ' Subscribe'}
                  </button>
                </form>
                {subscribed && (
                  <p className="subscribe-success">
                    <i className="fas fa-check-circle"></i> Thanks for subscribing!
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>
              <i className="fas fa-copyright"></i> {currentYear} Carside.in. 
              All rights reserved. | Designed with LOVE <i className="fas fa-heart" style={{ color: '#ff0000' }}></i> for car enthusiasts by it'sOfficialh.mishra0001
            </p>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <span className="separator">|</span>
              <a href="#">Terms of Service</a>
              <span className="separator">|</span>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* CSS for Toast and Enhancements */}
      <style jsx>{`
        .footer-toast {
          position: fixed;
          bottom: 30px;
          right: 20px;
          background: #1a1a1a;
          color: #fff;
          padding: 12px 24px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 1000;
          animation: slideUp 0.3s ease;
          border-left: 4px solid #b9d024;
          font-size: 0.9rem;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .social-link {
          transition: all 0.3s ease;
        }
        .social-link:hover {
          transform: translateY(-3px);
          color: var(--social-color) !important;
        }
        .subscribe-success {
          margin-top: 8px;
          font-size: 0.75rem;
          color: #00ff88;
          text-align: center;
        }
        .separator {
          color: #333;
          margin: 0 5px;
        }
        .footer-contact a {
          color: var(--gray-100);
          text-decoration: none;
          transition: color 0.3s;
        }
        .footer-contact a:hover {
          color: #b9d024;
        }
      `}</style>
    </>
  );
}

export default Footer;