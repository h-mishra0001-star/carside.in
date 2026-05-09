import React, { useState } from 'react';

function EMICalculator() {
  const [formData, setFormData] = useState({
    price: '',
    downPayment: '',
    interestRate: 9.5,
    loanTenure: 5
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear result when user changes inputs
    setResult(null);
  };

  const validateInputs = () => {
    const price = parseFloat(formData.price);
    const down = parseFloat(formData.downPayment);
    const rate = parseFloat(formData.interestRate);
    const years = parseFloat(formData.loanTenure);

    if (isNaN(price) || price <= 0) {
      setResult({ error: 'Please enter a valid car price' });
      return false;
    }
    if (isNaN(down) || down < 0) {
      setResult({ error: 'Please enter a valid down payment amount' });
      return false;
    }
    if (down >= price) {
      setResult({ error: 'Down payment cannot be greater than or equal to car price' });
      return false;
    }
    if (isNaN(rate) || rate < 0 || rate > 50) {
      setResult({ error: 'Please enter a valid interest rate (0-50%)' });
      return false;
    }
    if (isNaN(years) || years < 1 || years > 20) {
      setResult({ error: 'Please enter a valid loan tenure (1-20 years)' });
      return false;
    }
    return true;
  };

  const calculateEMI = () => {
    if (!validateInputs()) return;
    
    setLoading(true);
    
    // Small delay for better UX
    setTimeout(() => {
      const price = parseFloat(formData.price);
      const down = parseFloat(formData.downPayment);
      const rate = parseFloat(formData.interestRate);
      const years = parseFloat(formData.loanTenure);
      
      const loanAmount = price - down;
      const monthlyRate = rate / 100 / 12;
      const months = years * 12;
      
      let emi, totalPayment, totalInterest;
      
      if (monthlyRate > 0) {
        const factor = Math.pow(1 + monthlyRate, months);
        emi = loanAmount * monthlyRate * factor / (factor - 1);
        totalPayment = emi * months;
        totalInterest = totalPayment - loanAmount;
      } else {
        emi = loanAmount / months;
        totalPayment = loanAmount;
        totalInterest = 0;
      }
      
      setResult({
        emi: emi.toFixed(2),
        totalPayment: totalPayment.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
        loanAmount: loanAmount.toFixed(2),
        monthlyRate: (monthlyRate * 100).toFixed(2),
        months: months
      });
      setLoading(false);
    }, 300);
  };

  const resetForm = () => {
    setFormData({
      price: '',
      downPayment: '',
      interestRate: 9.5,
      loanTenure: 5
    });
    setResult(null);
  };

  // Quick preset buttons
  const presets = [
    { label: '3 Years', tenure: 3 },
    { label: '5 Years', tenure: 5 },
    { label: '7 Years', tenure: 7 }
  ];

  const setTenurePreset = (years) => {
    setFormData({ ...formData, loanTenure: years });
    setResult(null);
  };

  return (
    <div className="emi-calculator">
      <div className="emi-header">
        <i className="fas fa-calculator"></i>
        <h3>EMI Calculator</h3>
        <p>Calculate your monthly car loan payments</p>
      </div>
      
      <div className="emi-inputs">
        <div className="input-group">
          <label>
            <i className="fas fa-dollar-sign"></i> Car Price ($)
          </label>
          <input 
            type="number" 
            name="price"
            placeholder="e.g., 50000" 
            value={formData.price}
            onChange={handleChange}
          />
        </div>
        
        <div className="input-group">
          <label>
            <i className="fas fa-hand-holding-usd"></i> Down Payment ($)
          </label>
          <input 
            type="number" 
            name="downPayment"
            placeholder="e.g., 10000" 
            value={formData.downPayment}
            onChange={handleChange}
          />
        </div>
        
        <div className="input-group">
          <label>
            <i className="fas fa-percent"></i> Interest Rate (%)
          </label>
          <input 
            type="number" 
            name="interestRate"
            step="0.1"
            value={formData.interestRate}
            onChange={handleChange}
          />
        </div>
        
        <div className="input-group">
          <label>
            <i className="fas fa-clock"></i> Loan Tenure (Years)
          </label>
          <input 
            type="number" 
            name="loanTenure"
            step="1"
            value={formData.loanTenure}
            onChange={handleChange}
          />
          <div className="tenure-presets">
            {presets.map(preset => (
              <button 
                key={preset.tenure}
                type="button"
                className={`preset-btn ${formData.loanTenure === preset.tenure ? 'active' : ''}`}
                onClick={() => setTenurePreset(preset.tenure)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="emi-actions">
        <button className="btn-primary btn-block" onClick={calculateEMI} disabled={loading}>
          {loading ? <i className="fas fa-spinner fa-spin"></i> : null}
          {loading ? 'Calculating...' : 'Calculate EMI'}
        </button>
        <button className="btn-outline btn-block" onClick={resetForm}>
          <i className="fas fa-undo"></i> Reset
        </button>
      </div>
      
      {result && (
        <div className="emi-result">
          {result.error ? (
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              {result.error}
            </div>
          ) : (
            <>
              <div className="emi-amount">
                <span className="emi-label">Monthly EMI</span>
                <strong>${result.emi}</strong>
                <span className="emi-note">for {result.months} months</span>
              </div>
              <div className="emi-details">
                <div className="detail-item">
                  <span>🏦 Loan Amount:</span>
                  <strong>${result.loanAmount}</strong>
                </div>
                <div className="detail-item">
                  <span>📈 Total Interest:</span>
                  <strong>${result.totalInterest}</strong>
                </div>
                <div className="detail-item highlight">
                  <span>💰 Total Payment:</span>
                  <strong>${result.totalPayment}</strong>
                </div>
                <div className="detail-item">
                  <span>📊 Interest Rate:</span>
                  <strong>{formData.interestRate}%</strong>
                </div>
              </div>
              <div className="emi-breakdown">
                <div className="breakdown-bar">
                  <div 
                    className="breakdown-principal" 
                    style={{ width: `${(parseFloat(result.loanAmount) / parseFloat(result.totalPayment)) * 100}%` }}
                  ></div>
                  <div 
                    className="breakdown-interest" 
                    style={{ width: `${(parseFloat(result.totalInterest) / parseFloat(result.totalPayment)) * 100}%` }}
                  ></div>
                </div>
                <div className="breakdown-labels">
                  <span><i className="fas fa-chart-line"></i> Principal</span>
                  <span><i className="fas fa-percent"></i> Interest</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default EMICalculator;