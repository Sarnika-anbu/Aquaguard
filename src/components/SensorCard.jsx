import React from 'react';
import { Waves, Calendar } from 'lucide-react';

export default function SensorCard({ flowRate, dailyConsumption }) {
  return (
    <div className="glass-card col-span-4" style={{ padding: '24px' }}>
      <div className="card-header">
        <h3 className="card-title">
          <Waves size={20} color="var(--accent-cyan)" />
          Water Flow & Usage
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '12px' }}>
        {/* Instantaneous Flow Rate */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            Current Flow Rate
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>
            {flowRate} <span style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-main)' }}>L/min</span>
          </div>
        </div>

        {/* Daily Total Volume */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} /> Daily Consumption
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--text-main)' }}>
            {dailyConsumption} <span style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>Liters</span>
          </div>
        </div>
      </div>
    </div>
  );
}
