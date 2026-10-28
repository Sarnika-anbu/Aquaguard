import React from 'react';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FilterStatus({ filterHealth, onResetFilters }) {
  const handleReset = () => {
    // Fire confetti celebration animation!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (onResetFilters) onResetFilters();
  };

  const filters = [
    { name: 'Sediment Pre-Filter', health: filterHealth.sediment },
    { name: 'Activated Carbon Block', health: filterHealth.carbon },
    { name: 'RO Membrane (0.0001 Micron)', health: filterHealth.roMembrane },
    { name: 'UV Disinfection Lamp', health: filterHealth.uvLamp }
  ];

  return (
    <div className="glass-card col-span-4" style={{ padding: '24px' }}>
      <div className="card-header">
        <h3 className="card-title">
          <ShieldCheck size={20} color="var(--accent-cyan)" />
          Filter Lifespan Health
        </h3>
        <button
          className="btn-secondary"
          onClick={handleReset}
          style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <RefreshCw size={12} /> Reset
        </button>
      </div>

      <div style={{ marginTop: '16px' }}>
        {filters.map((item, index) => (
          <div key={index} className="filter-item">
            <div className="filter-info">
              <span>{item.name}</span>
              <span style={{ fontWeight: '600', color: item.health < 80 ? 'var(--status-warning)' : 'var(--accent-cyan)' }}>
                {item.health}%
              </span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${item.health}%`,
                  background: item.health < 80 ? 'var(--status-warning)' : 'linear-gradient(90deg, var(--accent-blue), var(--accent-cyan))'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
