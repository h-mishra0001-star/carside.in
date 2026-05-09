import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    
    const toast = document.createElement('div');
    toast.className = 'logout-toast';
    toast.innerHTML = '<i class="fas fa-check-circle"></i> Logged out successfully!';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
    
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/new-releases?search=${encodeURIComponent(searchQuery)}`);
      setSearchActive(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: 'fas fa-home' },
    { path: '/new-releases', label: 'New Releases', icon: 'fas fa-car' },
    { path: '/brands', label: 'Brands', icon: 'fas fa-trademark' },
    { path: '/compare', label: 'Compare', icon: 'fas fa-chart-line' },
    { path: '/social', label: 'Social', icon: 'fas fa-hashtag' },
    { path: '/about', label: 'About', icon: 'fas fa-info-circle' }
  ];

  const getUserInitials = () => {
    if (user?.fullName) {
      return user.fullName.charAt(0).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="logo">
          <Link to="/">
            <i className="fas fa-car-side"></i> 
            <span className="logo-text">CARSIDE<span>.in</span></span>
          </Link>
        </div>
        
        <div className={`nav-search ${searchActive ? 'active' : ''}`}>
          <form onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search cars, brands..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>
        
        <div className="nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </div>
        
        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          {navLinks.map(link => (
            <li key={link.path}>
              <Link 
                to={link.path} 
                className={location.pathname === link.path ? 'active' : ''}
                onClick={() => setIsMenuOpen(false)}
              >
                <i className={link.icon}></i>
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
          
          <li className="mobile-search-toggle">
            <button onClick={() => setSearchActive(!searchActive)}>
              <i className="fas fa-search"></i> Search
            </button>
          </li>
          
          <li>
            {isLoggedIn ? (
              <div className="user-menu">
                <div className="user-avatar" onClick={() => navigate('/profile')}>
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.username} />
                  ) : (
                    <span className="avatar-initials">{getUserInitials()}</span>
                  )}
                  <span className="user-name">{user?.username || 'User'}</span>
                  <i className="fas fa-chevron-down"></i>
                </div>
                <div className="user-dropdown">
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-user"></i> My Profile
                  </Link>
                  <Link to="/my-bookings" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-calendar-check"></i> My Bookings
                  </Link>
                  <Link to="/saved-cars" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-heart"></i> Saved Cars
                  </Link>
                  <hr />
                  <button onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </div>
              </div>
            ) : (
              <button className="btn-login" onClick={() => setShowLogin(true)}>
                <i className="fas fa-user"></i> 
                <span>Login</span>
              </button>
            )}
          </li>
        </ul>
      </nav>
      
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        onRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }} 
      />
      
      <RegisterModal 
        isOpen={showRegister} 
        onClose={() => setShowRegister(false)} 
        onLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }} 
      />
    </>
  );
}

export default Navbar;