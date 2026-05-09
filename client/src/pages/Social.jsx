import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Social() {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [feedPosts, setFeedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchBrands();
    generateFeed();
    window.scrollTo(0, 0);
  }, []);

  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const fetchBrands = async () => {
    try {
      const response = await api.get('/brands');
      setBrands(response.data.slice(0, 8));
    } catch (error) {
      console.error('Error fetching brands:', error);
      // Fallback brands
      setBrands([
        { _id: 1, name: 'Toyota', logoUrl: 'https://www.freepnglogos.com/uploads/toyota-logo-png/toyota-logo-emblems-logos-0.png', social: { instagram: 'toyota_india', followers: '2.5M' } },
        { _id: 2, name: 'Honda', logoUrl: 'https://www.freepnglogos.com/uploads/honda-logo-png/honda-logo-emblems-logos-0.png', social: { instagram: 'honda_india', followers: '1.8M' } },
        { _id: 3, name: 'BMW', logoUrl: 'https://www.freepnglogos.com/uploads/bmw-logo-png/bmw-logo-emblems-logos-0.png', social: { instagram: 'bmw_india', followers: '3.2M' } },
        { _id: 4, name: 'Mercedes', logoUrl: 'https://www.freepnglogos.com/uploads/mercedes-benz-logo-png/mercedes-benz-logo-emblems-logos-0.png', social: { instagram: 'mercedesbenz_india', followers: '4.1M' } }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const generateFeed = () => {
    const images = [
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d',
      'https://images.unsplash.com/photo-1614200187524-dc4b892acf16',
      'https://images.unsplash.com/photo-1607860108855-64acf2078ed9',
      'https://images.unsplash.com/photo-1621135802920-133df287f89c',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738'
    ];
    
    const usernames = ['toyota_india', 'honda_india', 'bmw_india', 'mercedesbenz_india'];
    const captions = [
      'Check out this beauty! 🔥 #Carside #Automotive',
      'New arrival! 🚗✨ #DreamCar',
      'Performance meets luxury 💪 #Carside',
      'The future is here! ⚡ #ElectricVehicles'
    ];
    
    const posts = Array(12).fill().map((_, i) => ({
      id: i,
      image: `${images[i % images.length]}?w=400&h=400&fit=crop`,
      likes: Math.floor(Math.random() * 50000) + 10000,
      comments: Math.floor(Math.random() * 5000) + 500,
      username: usernames[i % usernames.length],
      caption: captions[i % captions.length],
      timestamp: `${Math.floor(Math.random() * 23) + 1} hours ago`
    }));
    setFeedPosts(posts);
  };

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
    showNotification(`Showing posts from ${brand.name}`);
    setTimeout(() => {
      const feedElement = document.getElementById('brandSocialFeed');
      if (feedElement) {
        feedElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleFollow = (brandName, e) => {
    e.stopPropagation();
    showNotification(`Following ${brandName} on Instagram!`);
  };

  const handleHashTagClick = (tag) => {
    showNotification(`Searching for ${tag}`);
  };

  const handlePlatformClick = (platform) => {
    showNotification(`Opening ${platform.name} page`);
  };

  const socialPlatforms = [
    { name: 'Instagram', icon: 'fab fa-instagram', color: '#E4405F', handle: '@carside_in' },
    { name: 'Facebook', icon: 'fab fa-facebook', color: '#1877F2', handle: '/carside.in' },
    { name: 'Twitter', icon: 'fab fa-twitter', color: '#1DA1F2', handle: '@carside_in' },
    { name: 'YouTube', icon: 'fab fa-youtube', color: '#FF0000', handle: '@carside_in' },
    { name: 'LinkedIn', icon: 'fab fa-linkedin', color: '#0077B5', handle: 'carside-in' }
  ];

  const trendingHashtags = [
    '#Carside', '#Supercars', '#ElectricVehicles', '#CarEnthusiast',
    '#AutoShow2026', '#PerformanceCars', '#LuxuryAutos', '#FutureOfMobility',
    '#CarReview', '#TestDrive', '#Hypercar', '#EVolution'
  ];

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div className="social-toast">
          <i className="fas fa-heart" style={{ color: '#b9d024' }}></i>
          {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>Social Hub</h1>
          <p>Connect with your favorite automotive brands</p>
        </div>
      </section>

      {/* Brand Social Cards */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2><i className="fas fa-hashtag"></i> Follow Brands</h2>
            <p>Get exclusive updates and behind-the-scenes content</p>
          </div>
          
          {loading ? (
            <div className="loading-state">
              <div className="loader"></div>
              <p>Loading brands...</p>
            </div>
          ) : (
            <div className="social-grid">
              {brands.map(brand => (
                <div key={brand._id} className="social-card" onClick={() => handleBrandClick(brand)}>
                  <div className="social-card-header">
                    <img src={brand.logoUrl} alt={brand.name} />
                    <div className="social-card-info">
                      <h3>{brand.name}</h3>
                      <p>@{brand.social?.instagram || `${brand.name.toLowerCase()}_official`}</p>
                    </div>
                  </div>
                  <div className="social-card-stats">
                    <div className="stat">
                      <i className="fab fa-instagram"></i>
                      <span>{brand.social?.followers || '1M+'}</span>
                      <label>Followers</label>
                    </div>
                    <div className="stat">
                      <i className="fas fa-image"></i>
                      <span>500+</span>
                      <label>Posts</label>
                    </div>
                  </div>
                  <button className="btn-outline btn-small" onClick={(e) => handleFollow(brand.name, e)}>
                    <i className="fab fa-instagram"></i> Follow
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Selected Brand Feed */}
      {selectedBrand && (
        <section id="brandSocialFeed" className="section" style={{ background: 'var(--gray-400)' }}>
          <div className="container">
            <div className="section-header">
              <h2><i className="fab fa-instagram"></i> @{selectedBrand.social?.instagram || `${selectedBrand.name.toLowerCase()}_official`}</h2>
              <p>Latest posts from {selectedBrand.name}</p>
              <button className="btn-outline btn-small" onClick={() => setSelectedBrand(null)}>
                <i className="fas fa-times"></i> Close Feed
              </button>
            </div>
            
            <div className="instagram-feed">
              {feedPosts
                .filter(post => post.username === (selectedBrand.social?.instagram || `${selectedBrand.name.toLowerCase()}_official`))
                .slice(0, 6)
                .map(post => (
                  <div key={post.id} className="feed-item">
                    <div className="feed-header">
                      <img src={selectedBrand.logoUrl} alt={selectedBrand.name} />
                      <div>
                        <strong>{selectedBrand.name}</strong>
                        <span>@{post.username}</span>
                      </div>
                    </div>
                    <img src={post.image} alt="Instagram post" loading="lazy" />
                    <div className="feed-stats">
                      <span><i className="fas fa-heart"></i> {(post.likes / 1000).toFixed(1)}K</span>
                      <span><i className="fas fa-comment"></i> {(post.comments / 1000).toFixed(1)}K</span>
                    </div>
                    <div className="feed-caption">
                      <strong>{selectedBrand.name}</strong> {post.caption}
                    </div>
                    <div className="feed-time">
                      <i className="far fa-clock"></i> {post.timestamp}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Social Platforms Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2><i className="fas fa-share-alt"></i> Connect Everywhere</h2>
            <p>Follow Carside.in on all social platforms</p>
          </div>
          
          <div className="platforms-grid">
            {socialPlatforms.map(platform => (
              <div 
                key={platform.name} 
                className="platform-card" 
                style={{ borderTop: `4px solid ${platform.color}` }}
                onClick={() => handlePlatformClick(platform)}
              >
                <i className={platform.icon} style={{ color: platform.color }}></i>
                <h3>{platform.name}</h3>
                <p>{platform.handle}</p>
                <span className="platform-followers">10.5K followers</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Hashtags */}
      <section className="section" style={{ background: 'var(--gray-400)' }}>
        <div className="container">
          <div className="section-header">
            <h2><i className="fas fa-fire"></i> Trending Now</h2>
            <p>Popular hashtags in the automotive community</p>
          </div>
          
          <div className="hashtags-cloud">
            {trendingHashtags.map(tag => (
              <span key={tag} className="hashtag" onClick={() => handleHashTagClick(tag)}>
                <i className="fas fa-hashtag"></i> {tag.substring(1)}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CSS for Toast */}
      <style jsx>{`
        .social-toast {
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
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default Social;