import React from 'react';

function ComparisonTable({ car1, car2 }) {
  const specs = [
    { label: '💰 Price', key1: 'price', key2: 'price', format: (val) => `$${val?.toLocaleString()}`, better: 'lower' },
    { label: '⚙️ Engine', key1: 'engine', key2: 'engine', format: (val) => val || 'N/A', better: null },
    { label: '💪 Horsepower', key1: 'horsepower', key2: 'horsepower', format: (val) => `${val || 0} HP`, better: 'higher' },
    { label: '🔧 Torque', key1: 'torque', key2: 'torque', format: (val) => val || 'N/A', better: null },
    { label: '⚡ 0-60 mph', key1: 'acceleration', key2: 'acceleration', format: (val) => val || 'N/A', better: 'lower' },
    { label: '🏁 Top Speed', key1: 'topSpeed', key2: 'topSpeed', format: (val) => val || 'N/A', better: 'higher' },
    { label: '🔄 Transmission', key1: 'transmission', key2: 'transmission', format: (val) => val || 'N/A', better: null },
    { label: '🔘 Drive Type', key1: 'driveType', key2: 'driveType', format: (val) => val || 'N/A', better: null },
    { label: '⛽ Fuel Economy', key1: 'fuelEconomy', key2: 'fuelEconomy', format: (val) => val || 'N/A', better: 'higher' },
    { label: '⚖️ Weight', key1: 'weight', key2: 'weight', format: (val) => val || 'N/A', better: 'lower' },
    { label: '🚗 Seating', key1: 'seatingCapacity', key2: 'seatingCapacity', format: (val) => `${val || 5} seats`, better: null }
  ];

  const getWinner = (spec, val1, val2) => {
    if (!val1 || !val2 || spec.better === null) return '';
    
    const num1 = parseFloat(val1);
    const num2 = parseFloat(val2);
    
    if (isNaN(num1) || isNaN(num2)) return '';
    
    if (spec.better === 'lower') {
      return num1 < num2 ? '🏆 Winner' : num1 > num2 ? '' : '⚖️ Draw';
    }
    if (spec.better === 'higher') {
      return num1 > num2 ? '🏆 Winner' : num1 < num2 ? '' : '⚖️ Draw';
    }
    return '';
  };

  const getScoreColor = (spec, val1, val2) => {
    if (!val1 || !val2 || spec.better === null) return '';
    
    const num1 = parseFloat(val1);
    const num2 = parseFloat(val2);
    
    if (isNaN(num1) || isNaN(num2)) return '';
    
    if (spec.better === 'lower') {
      return num1 < num2 ? 'better' : num1 > num2 ? 'worse' : 'equal';
    }
    if (spec.better === 'higher') {
      return num1 > num2 ? 'better' : num1 < num2 ? 'worse' : 'equal';
    }
    return '';
  };

  const hasData = car1 || car2;

  if (!hasData) {
    return (
      <div className="comparison-empty">
        <i className="fas fa-chart-line"></i>
        <h3>No Cars Selected</h3>
        <p>Click on "Add Car 1" and "Add Car 2" to start comparing</p>
      </div>
    );
  }

  return (
    <div className="comparison-table">
      <div className="comparison-row header">
        <div className="spec-label">📊 Specifications</div>
        <div className="car-spec car-header">
          {car1 ? (
            <>
              <img src={car1.imageUrl?.replace('w=500', 'w=80')} alt={car1.modelName} className="car-thumb" />
              <strong>{car1.modelName}</strong>
            </>
          ) : (
            <span className="empty-select">❌ No Car Selected</span>
          )}
        </div>
        <div className="car-spec car-header">
          {car2 ? (
            <>
              <img src={car2.imageUrl?.replace('w=500', 'w=80')} alt={car2.modelName} className="car-thumb" />
              <strong>{car2.modelName}</strong>
            </>
          ) : (
            <span className="empty-select">❌ No Car Selected</span>
          )}
        </div>
      </div>
      
      {specs.map((spec, idx) => {
        const val1 = car1?.[spec.key1];
        const val2 = car2?.[spec.key2];
        const formattedVal1 = spec.format ? spec.format(val1) : val1 || '—';
        const formattedVal2 = spec.format ? spec.format(val2) : val2 || '—';
        const winner = car1 && car2 ? getWinner(spec, val1, val2) : '';
        const scoreColor = car1 && car2 ? getScoreColor(spec, val1, val2) : '';
        
        return (
          <div key={idx} className="comparison-row">
            <div className="spec-label">{spec.label}</div>
            <div className={`car-spec ${scoreColor === 'better' ? 'winner' : scoreColor === 'worse' ? 'loser' : ''}`}>
              {formattedVal1}
              {winner === '🏆 Winner' && <span className="winner-badge">{winner}</span>}
            </div>
            <div className={`car-spec ${scoreColor === 'better' ? 'loser' : scoreColor === 'worse' ? 'winner' : ''}`}>
              {formattedVal2}
              {winner === '🏆 Winner' && <span className="winner-badge" style={{ visibility: 'hidden' }}></span>}
            </div>
          </div>
        );
      })}
      
      {/* Winner Summary */}
      {car1 && car2 && (
        <div className="comparison-summary">
          <div className="summary-text">
            <i className="fas fa-trophy"></i>
            Comparison Complete - Check the specifications above to see which car performs better!
          </div>
        </div>
      )}
    </div>
  );
}

export default ComparisonTable;