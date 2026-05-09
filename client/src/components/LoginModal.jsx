import React, { useState } from 'react';
import api from '../services/api';

function LoginModal({ isOpen, onClose, onRegister }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', formData);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        onClose();
        // Show success message before reload
        const successMsg = document.createElement('div');
        successMsg.className = 'login-success-toast';
        successMsg.innerHTML = `<i class="fas fa-check-circle"></i> Welcome back, ${response.data.user.username || 'User'}!`;
        document.body.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 2000);
        
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Load remembered email on mount
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleDemoLogin = () => {
    setFormData({
      email: 'demo@carside.in',
      password: 'demo123'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content modal-login">
        <span className="close" onClick={onClose}>&times;</span>
        
        <div className="modal-header">
          <div className="modal-icon">
            <i className="fas fa-car-side"></i>
          </div>
          <h2>Welcome Back</h2>
          <p>Login to your Carside.in account</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <i className="fas fa-envelope"></i>
            <input 
              type="email" 
              name="email"
              placeholder="Email Address" 
              value={formData.email}
              onChange={handleChange}
              required 
              autoFocus
            />
          </div>
          
          <div className="input-group">
            <i className="fas fa-lock"></i>
            <input 
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
            <button 
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
          
          <div className="login-options">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-password" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to your email!'); }}>
              Forgot Password?
            </a>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="btn-primary btn-block" disabled={loading}>
            {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-sign-in-alt"></i>}
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          <button type="button" className="btn-outline btn-block demo-btn" onClick={handleDemoLogin}>
            <i className="fas fa-user-secret"></i> Try Demo Account
          </button>
          
          <div className="modal-footer">
            <p className="signup-text">
              New user? <a href="#" onClick={onRegister}>Create Account</a>
            </p>
          </div>
        </form>
        
        <div className="modal-alternatives">
          <div className="divider">
            <span>Or continue with</span>
          </div>
          <div className="social-login">
            <button className="social-btn google" onClick={() => alert('Google login coming soon!')}>
              <i className="fab fa-google"></i>
            </button>
            <button className="social-btn facebook" onClick={() => alert('Facebook login coming soon!')}>
              <i className="fab fa-facebook-f"></i>
            </button>
            <button className="social-btn twitter" onClick={() => alert('Twitter login coming soon!')}>
              <i className="fab fa-twitter"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Add CSS */}
      <style jsx>{`
        .modal-login {
          max-width: 450px;
        }
        
        .modal-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #b9d024, #f9f075);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 15px;
        }
        
        .modal-icon i {
          font-size: 1.8rem;
          color: #090909;
        }
        
        .input-group {
          position: relative;
          margin-bottom: 15px;
        }
        
        .input-group i:first-child {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #b9d024;
          z-index: 1;
        }
        
        .input-group input {
          width: 100%;
          padding: 12px 40px;
          background: var(--gray-600);
          border: 1px solid var(--gray-500);
          border-radius: 8px;
          color: white;
          font-size: 1rem;
          transition: all 0.3s;
        }
        
        .input-group input:focus {
          outline: none;
          border-color: #b9d024;
          box-shadow: 0 0 10px rgba(185, 208, 36, 0.3);
        }
        
        .password-toggle {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #b9d024;
          cursor: pointer;
        }
        
        .login-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          font-size: 0.85rem;
        }
        
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: var(--gray-100);
        }
        
        .checkbox-label input {
          cursor: pointer;
        }
        
        .demo-btn {
          margin-top: 10px;
        }
        
        .divider {
          text-align: center;
          margin: 20px 0;
          position: relative;
        }
        
        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: var(--gray-600);
        }
        
        .divider span {
          background: var(--gray-700);
          padding: 0 15px;
          position: relative;
          font-size: 0.8rem;
          color: var(--gray-100);
        }
        
        .social-login {
          display: flex;
          justify-content: center;
          gap: 15px;
        }
        
        .social-btn {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          border: none;
          color: white;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .social-btn.google {
          background: #DB4437;
        }
        .social-btn.facebook {
          background: #4267B2;
        }
        .social-btn.twitter {
          background: #1DA1F2;
        }
        .social-btn:hover {
          transform: translateY(-3px);
        }
        
        .login-success-toast {
          position: fixed;
          top: 100px;
          right: 20px;
          background: #00ff88;
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
    </div>
  );
}

export default LoginModal;