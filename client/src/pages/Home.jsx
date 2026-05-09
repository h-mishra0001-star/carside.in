import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Hero from '../components/Hero';
import CarCard from '../components/CarCard';
import BrandCard from '../components/BrandCard';
import VideoCard from '../components/VideoCard';

function Home() {
  const navigate = useNavigate();
  const [newReleases, setNewReleases] = useState([]);
  const [topBrands, setTopBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    cars: 0,
    brands: 0,
    users: 0,
    reviews: 0
  });
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchData();
    }
    window.scrollTo(0, 0);
  }, []);

  const fetchData = async () => {
    try {
      const [carsRes, brandsRes] = await Promise.all([
        api.get('/cars?newOnly=true&limit=4'),
        api.get('/brands?limit=6')
      ]);
      
      // Ensure data is always an array
      const carsData = Array.isArray(carsRes.data) ? carsRes.data : [];
      const brandsData = Array.isArray(brandsRes.data) ? brandsRes.data : [];
      
      setNewReleases(carsData);
      setTopBrands(brandsData);
      setStats(prev => ({ 
        ...prev, 
        brands: brandsData.length
      }));
      
      animateStats();
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const animateStats = () => {
    const targets = { cars: 500, users: 1000000, reviews: 5000 };
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setStats(prev => ({
        ...prev,
        cars: Math.floor(targets.cars * progress),
        users: Math.floor(targets.users * progress),
        reviews: Math.floor(targets.reviews * progress)
      }));
      
      if (currentStep >= steps) clearInterval(interval);
    }, stepTime);
  };

  const updates = [
    { id: 1, icon: 'fa-car', title: 'Toyota Supra 2026', desc: 'Launching with 382hp hybrid engine', badge: 'New', color: '#e63946' },
    { id: 2, icon: 'fa-charging-station', title: 'Tesla Model S Plaid+', desc: '520 miles range, 0-60 in 1.99s', badge: 'Electric', color: '#00d4ff' },
    { id: 3, icon: 'fa-tachometer-alt', title: 'BMW M5 CS', desc: '627hp V8, 190mph top speed', badge: 'Performance', color: '#ff6b6b' },
    { id: 4, icon: 'fa-leaf', title: 'Mercedes EQE SUV', desc: 'Premium electric SUV unveiled', badge: 'Eco', color: '#00ff88' }
  ];

  const features = [
    { icon: 'fa-bell', title: 'Instant Updates', desc: 'Get real-time notifications about new launches and bookings' },
    { icon: 'fa-mobile-alt', title: 'Mobile & Web App', desc: 'Seamless experience across all devices with dedicated app' },
    { icon: 'fa-chart-line', title: 'Smart Comparisons', desc: 'AI-powered car comparisons with detailed specs' },
    { icon: 'fa-gem', title: 'Exclusive Content', desc: 'Behind the scenes, reviews, and brand collaborations' }
  ];

  const featuredVideos = [
    {
      id: 1,
      title: 'Lamborghini Revuelto - First Drive',
      thumbnail: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500',
      views: '2.5M',
      timeAgo: '1 week ago',
      channel: 'Top Gear',
      duration: '12:34'
    },
    {
      id: 2,
      title: 'Porsche 911 GT3 RS - Track Test',
      thumbnail: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=500',
      views: '1.8M',
      timeAgo: '3 days ago',
      channel: 'CarWow',
      duration: '15:22'
    },
    {
      id: 3,
      title: 'Tesla Cybertruck - Off-road Test',
      thumbnail: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=500',
      views: '3.2M',
      timeAgo: '5 days ago',
      channel: 'Tesla Insider',
      duration: '18:45'
    }
  ];

  if (error) {
    return (
      <div className="error-state">
        <i className="fas fa-exclamation-triangle"></i>
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button className="btn-primary" onClick={() => window.location.reload()}>
          Refresh Page
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loader"></div>
        <p>Loading amazing cars...</p>
      </div>
    );
  }

  // Safety check - ensure newReleases is an array
  const safeNewReleases = Array.isArray(newReleases) ? newReleases : [];
  const safeTopBrands = Array.isArray(topBrands) ? topBrands : [];

  return (
    <>
      <Hero />

      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <i className="fas fa-car"></i>
              <h3>{stats.cars.toLocaleString()}+</h3>
              <p>Car Models</p>
            </div>
            <div className="stat-card">
              <i className="fas fa-trademark"></i>
              <h3>{stats.brands}+</h3>
              <p>Top Brands</p>
            </div>
            <div className="stat-card">
              <i className="fas fa-users"></i>
              <h3>{stats.users.toLocaleString()}+</h3>
              <p>Happy Users</p>
            </div>
            <div className="stat-card">
              <i className="fas fa-star"></i>
              <h3>{stats.reviews.toLocaleString()}+</h3>
              <p>Expert Reviews</p>
            </div>
          </div>
        </div>
      </section>

      <section className="updates">
        <div className="container">
          <div className="section-header">
            <h2><i className="fas fa-newspaper"></i> Latest Updates</h2>
            <p>Stay ahead with the newest automotive news</p>
          </div>
          <div className="updates-grid">
            {updates.map(update => (
              <div key={update.id} className="update-card" onClick={() => navigate('/new-releases')}>
                <div className="update-icon" style={{ background: `${update.color}20` }}>
                  <i className={`fas ${update.icon}`} style={{ color: update.color }}></i>
                </div>
                <h3>{update.title}</h3>
                <p>{update.desc}</p>
                <span className="badge" style={{ background: update.color }}>{update.badge}</span>
                <div className="update-hover-effect"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="new-releases-preview">
        <div className="container">
          <div className="section-header">
            <h2><i className="fas fa-fire"></i> Hot New Releases</h2>
            <p>Check out the latest cars hitting the market</p>
            <button className="btn-outline btn-small" onClick={() => navigate('/new-releases')}>
              View All <i className="fas fa-arrow-right"></i>
            </button>
          </div>
          
          {safeNewReleases.length === 0 ? (
            <div className="no-results">
              <i className="fas fa-car"></i>
              <p>No new releases available</p>
            </div>
          ) : (
            <div className="releases-grid">
              {safeNewReleases.map(car => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="featured-videos">
        <div className="container">
          <div className="section-header">
            <h2><i className="fas fa-video"></i> Featured Videos</h2>
            <p>Watch the latest reviews and test drives</p>
          </div>
          <div className="videos-grid">
            {featuredVideos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      </section>

      <section className="why-follow">
        <div className="container">
          <div className="section-header">
            <h2><i className="fas fa-star"></i> Why Follow Carside.in?</h2>
            <p>Your ultimate automotive companion</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <i className={`fas ${feature.icon}`}></i>
                  <div className="icon-glow"></div>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="top-brands">
        <div className="container">
          <div className="section-header">
            <h2><i className="fas fa-trademark"></i> Top Brands</h2>
            <p>Explore premium automotive manufacturers</p>
          </div>
          
          {safeTopBrands.length === 0 ? (
            <div className="no-results">
              <i className="fas fa-trademark"></i>
              <p>No brands available</p>
            </div>
          ) : (
            <div className="brands-slider">
              {safeTopBrands.map(brand => (
                <BrandCard key={brand._id} brand={brand} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Find Your Dream Car?</h2>
            <p>Join thousands of car enthusiasts who trust Carside.in for their automotive journey</p>
            <div className="cta-buttons">
              <button className="btn-primary btn-large" onClick={() => navigate('/new-releases')}>
                <i className="fas fa-search"></i> Start Exploring
              </button>
              <button className="btn-outline btn-large" onClick={() => navigate('/compare')}>
                <i className="fas fa-chart-line"></i> Compare Cars
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;