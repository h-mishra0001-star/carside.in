import React, { useState } from 'react';
import api from '../services/api';

function RegisterModal({ isOpen, onClose, onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateForm = () => {
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }
    if (formData.username.length > 20) {
      setError('Username must be less than 20 characters');
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return false;
    }
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!agreeTerms) {
      setError('Please agree to the Terms of Service');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName
      });
      
      if (response.data.success) {
        // Show success toast
        const toast = document.createElement('div');
        toast.className = 'register-success-toast';
        toast.innerHTML = '<i class="fas fa-check-circle"></i> Registration successful! Please login.';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
        
        setTimeout(() => {
          onLogin();
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content modal-register">
        <span className="close" onClick={onClose}>&times;</span>
        
        <div className="modal-header">
          <div className="modal-icon">
            <i className="fas fa-user-plus"></i>
          </div>
          <h2>Create Account</h2>
          <p>Join the Carside.in community</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <i className="fas fa-user"></i>
            <input 
              type="text" 
              name="username"
              placeholder="Username (min 3 characters)" 
              value={formData.username}
              onChange={handleChange}
              required 
              autoFocus
            />
            <span className="input-hint">Letters, numbers, underscores only</span>
          </div>
          
          <div className="input-group">
            <i className="fas fa-envelope"></i>
            <input 
              type="email" 
              name="email"
              placeholder="Email Address" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="input-group">
            <i className="fas fa-user-tag"></i>
            <input 
              type="text" 
              name="fullName"
              placeholder="Full Name (Optional)" 
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          
          <div className="input-group">
            <i className="fas fa-lock"></i>
            <input 
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password (min 6 characters)" 
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
          
          <div className="input-group">
            <i className="fas fa-lock"></i>
            <input 
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password" 
              value={formData.confirmPassword}
              onChange={handleChange}
              required 
            />
            <button 
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
          
          <div className="terms-checkbox">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span>I agree to the <a href="#" onClick={(e) => { e.preventDefault(); alert('Terms of Service'); }}>Terms of Service</a> and <a href="#" onClick={(e) => { e.preventDefault(); alert('Privacy Policy'); }}>Privacy Policy</a></span>
            </label>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="btn-primary btn-block" disabled={loading}>
            {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-user-plus"></i>}
            {loading ? 'Creating account...' : 'Register'}
          </button>
          
          <div className="modal-footer">
            <p className="signup-text">
              Already have an account? <a href="#" onClick={onLogin}>Login</a>
            </p>
          </div>
        </form>
        
        <div className="modal-alternatives">
          <div className="divider">
            <span>Or sign up with</span>
          </div>
          <div className="social-register">
            <button className="social-btn google" onClick={() => alert('Google sign up coming soon!')}>
              <i className="fab fa-google"></i> Google
            </button>
            <button className="social-btn facebook" onClick={() => alert('Facebook sign up coming soon!')}>
              <i className="fab fa-facebook-f"></i> Facebook
            </button>
          </div>
        </div>
      </div>

      {/* Add CSS for Register Modal */}
      <style jsx>{`
        .modal-register {
          max-width: 480px;
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
        
        .input-hint {
          display: block;
          font-size: 0.7rem;
          color: #666;
          margin-top: 5px;
          margin-left: 10px;
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
        
        .terms-checkbox {
          margin: 15px 0;
        }
        
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 0.85rem;
          color: var(--gray-100);
        }
        
        .checkbox-label a {
          color: #b9d024;
          text-decoration: none;
        }
        
        .checkbox-label a:hover {
          text-decoration: underline;
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
        
        .social-register {
          display: flex;
          justify-content: center;
          gap: 15px;
        }
        
        .social-btn {
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          color: white;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .social-btn.google {
          background: #DB4437;
        }
        .social-btn.facebook {
          background: #4267B2;
        }
        .social-btn:hover {
          transform: translateY(-2px);
        }
        
        .register-success-toast {
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

export default RegisterModal;