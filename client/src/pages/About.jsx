import React, { useEffect, useState } from 'react';
import api from '../services/api';

function About() {
  const [stats, setStats] = useState({ cars: 0, brands: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    window.scrollTo(0, 0);
  }, []);

  const fetchStats = async () => {
    try {
      const [carsRes, brandsRes] = await Promise.all([
        api.get('/cars'),
        api.get('/brands')
      ]);
      setStats({
        cars: carsRes.data?.length || 0,
        brands: brandsRes.data?.length || 0,
        users: 1250000
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback data if API fails
      setStats({
        cars: 8,
        brands: 8,
        users: 1250000
      });
    } finally {
      setLoading(false);
    }
  };

  const timeline = [
    { year: 2020, title: 'The Vision Begins', desc: 'Carside.in was founded with a mission to revolutionize car discovery', icon: 'fa-lightbulb', color: '#b9d024' },
    { year: 2021, title: 'Beta Launch', desc: 'First version launched with 20+ brand partnerships', icon: 'fa-rocket', color: '#00d4ff' },
    { year: 2022, title: 'Official Launch', desc: 'Platform officially launched with 50+ brand partnerships worldwide', icon: 'fa-globe', color: '#00ff88' },
    { year: 2023, title: 'Mobile App', desc: 'Launched iOS and Android apps for seamless experience', icon: 'fa-mobile-alt', color: '#ff6b6b' },
    { year: 2024, title: '1 Million Users', desc: 'Reached milestone of 1 million active automotive enthusiasts', icon: 'fa-users', color: '#b9d024' },
    { year: 2025, title: 'AI Features', desc: 'Introduced AI-powered car comparisons and recommendations', icon: 'fa-robot', color: '#00d4ff' },
    { year: 2026, title: 'Global Expansion', desc: 'Expanding to international markets with new features', icon: 'fa-chart-line', color: '#00ff88' }
  ];

  const values = [
    { icon: 'fa-heart', title: 'Passion', desc: 'We live and breathe automobiles', color: '#ff6b6b' },
    { icon: 'fa-star', title: 'Excellence', desc: 'Committed to providing the best experience', color: '#b9d024' },
    { icon: 'fa-handshake', title: 'Trust', desc: 'Building honest relationships with users', color: '#00d4ff' },
    { icon: 'fa-lightbulb', title: 'Innovation', desc: 'Continuously evolving with technology', color: '#00ff88' }
  ];

  const teamMembers = [
    { name: 'Rajesh Kumar', role: 'Founder & CEO', image: 'https://randomuser.me/api/portraits/men/1.jpg', bio: '15+ years in automotive industry', linkedin: '#', twitter: '#' },
    { name: 'Priya Sharma', role: 'CTO', image: 'https://randomuser.me/api/portraits/women/2.jpg', bio: 'AI and Machine Learning expert', linkedin: '#', twitter: '#' },
    { name: 'Amit Patel', role: 'Head of Design', image: 'https://randomuser.me/api/portraits/men/3.jpg', bio: 'Former designer at Tesla', linkedin: '#', twitter: '#' },
    { name: 'Neha Gupta', role: 'Marketing Director', image: 'https://randomuser.me/api/portraits/women/4.jpg', bio: 'Digital marketing specialist', linkedin: '#', twitter: '#' }
  ];

  const testimonials = [
    { name: 'Rahul Mehta', role: 'Car Enthusiast', text: 'Carside.in made my car buying journey so easy! The comparison tool helped me choose the perfect car within my budget.', rating: 5 },
    { name: 'Priya Singh', role: 'First Time Buyer', text: 'Amazing platform! Found my dream car within days. The test drive booking was seamless.', rating: 5 },
    { name: 'Amit Verma', role: 'Auto Blogger', text: 'The most comprehensive car database I have ever seen. Highly recommended for car lovers!', rating: 5 }
  ];

  const handleSignUp = () => {
    const loginBtn = document.querySelector('.btn-login');
    if (loginBtn) loginBtn.click();
    else alert('Please click Login button to sign up!');
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>About Carside.in</h1>
          <p>The story behind India's fastest-growing automotive platform</p>
        </div>
      </section>

      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <div className="about-hero-text">
              <h2>Driving Innovation <span className="gradient-text">Since 2020</span></h2>
              <p>We started with a simple mission: to help car enthusiasts find their perfect ride. Today, we're India's most trusted automotive discovery platform, serving millions of users monthly.</p>
              <div className="about-stats">
                <div className="stat">
                  <h3 style={{ color: '#b9d024' }}>{stats.cars}+</h3>
                  <p>Car Models</p>
                </div>
                <div className="stat">
                  <h3 style={{ color: '#b9d024' }}>{stats.brands}+</h3>
                  <p>Premium Brands</p>
                </div>
                <div className="stat">
                  <h3 style={{ color: '#b9d024' }}>1.2M+</h3>
                  <p>Happy Users</p>
                </div>
              </div>
            </div>
            <div className="about-hero-image">
              <img src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600" alt="About Carside" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <i className="fas fa-car"></i>
              <h3>{stats.cars}+</h3>
              <p>Car Models</p>
            </div>
            <div className="stat-card">
              <i className="fas fa-trademark"></i>
              <h3>{stats.brands}+</h3>
              <p>Top Brands</p>
            </div>
            <div className="stat-card">
              <i className="fas fa-users"></i>
              <h3>1.2M+</h3>
              <p>Happy Users</p>
            </div>
            <div className="stat-card">
              <i className="fas fa-star"></i>
              <h3>4.9</h3>
              <p>User Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="container">
          <div className="section-header">
            <h2><i className="fas fa-history"></i> Our Journey</h2>
            <p>Milestones that shaped Carside.in</p>
          </div>
          <div className="timeline-vertical">
            {timeline.map((item, index) => (
              <div key={index} className={`timeline-item-vertical ${index % 2 === 0 ? 'left' : 'right'}`}>
                <div className="timeline-dot" style={{ background: item.color }}></div>
                <div className="timeline-content">
                  <div className="timeline-year" style={{ color: item.color }}>{item.year}</div>
                  <div className="timeline-icon" style={{ background: `${item.color}20` }}>
                    <i className={`fas ${item.icon}`} style={{ color: item.color }}></i>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <h2><i className="fas fa-gem"></i> Our Core Values</h2>
            <p>What drives us every day</p>
          </div>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon" style={{ background: `${value.color}20` }}>
                  <i className={`fas ${value.icon}`} style={{ color: value.color }}></i>
                </div>
                <h3>{value.title}</h3>
                <p>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <h2><i className="fas fa-users"></i> Meet Our Team</h2>
            <p>The passionate people behind Carside.in</p>
          </div>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-image">
                  <img src={member.image} alt={member.name} />
                  <div className="team-social">
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
                    <a href={member.twitter} target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                  </div>
                </div>
                <h3>{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2><i className="fas fa-comment-dots"></i> What Our Users Say</h2>
            <p>Trusted by millions of car enthusiasts</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <i className="fas fa-quote-left" style={{ color: '#b9d024', fontSize: '2rem', opacity: 0.5 }}></i>
                <p>"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <img src={`https://ui-avatars.com/api/?background=b9d024&color=fff&name=${testimonial.name.charAt(0)}`} alt={testimonial.name} />
                  <div>
                    <h4>{testimonial.name}</h4>
                    <span>{testimonial.role}</span>
                    <div className="testimonial-rating">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`fas fa-star ${i < testimonial.rating ? 'active' : ''}`} style={{ color: i < testimonial.rating ? '#b9d024' : '#ccc', fontSize: '0.8rem' }}></i>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to <span className="gradient-text">Join Our Community?</span></h2>
            <p>Be part of India's fastest-growing automotive platform with thousands of happy car enthusiasts.</p>
            <div className="cta-buttons">
              <button className="btn-primary btn-large" onClick={handleSignUp}>
                <i className="fas fa-user-plus"></i> Sign Up Now
              </button>
              <button className="btn-outline btn-large" onClick={() => window.location.href = '/new-releases'}>
                <i className="fas fa-car"></i> Explore Cars
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;