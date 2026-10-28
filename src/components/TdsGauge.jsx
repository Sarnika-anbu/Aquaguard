import React from 'react';
import { Activity } from 'lucide-react';

export default function TdsGauge({ tdsValue, tdsStatus }) {
  // Calculate percent for gauge circle (0 to 200 PPM max scale)
  const percent = Math.min(Math.round((tdsValue / 200) * 100), 100);

  // Dynamic status color calculation
  const getStatusColor = () => {
    if (tdsValue < 50) return 'var(--status-good)';
    if (tdsValue <= 150) return 'var(--status-warning)';
    return 'var(--status-danger)';
  };

  return (
    <div className="glass-card col-span-4" style={{ padding: '24px' }}>
      <div className="card-header">
        <h3 className="card-title">
          <Activity size={20} color="var(--accent-cyan)" />
          Water Quality (TDS)
        </h3>
      </div>

      <div className="gauge-wrapper">
        <div 
          className="gauge-circle" 
          style={{ '--gauge-percent': `${percent}%` }}
        >
          <div className="gauge-inner">
            <span className="gauge-value">{tdsValue}</span>
            <span className="gauge-unit">PPM</span>
          </div>
        </div>

        <div 
          className="gauge-status-badge"
          style={{
            background: `${getStatusColor()}20`,
            color: getStatusColor(),
            border: `1px solid ${getStatusColor()}40`
          }}
        >
          ● {tdsStatus} Quality ({tdsValue < 50 ? 'Safe RO' : 'Needs Filter Check'})
        </div>
      </div>
    </div>
  );
}
