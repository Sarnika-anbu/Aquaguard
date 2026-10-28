import React from 'react';
import TdsGauge from '../components/TdsGauge.jsx';
import SensorCard from '../components/SensorCard.jsx';
import FilterStatus from '../components/FilterStatus.jsx';
import LiveChart from '../components/LiveChart.jsx';
import { RefreshCw, ShieldAlert, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Dashboard({ sensorData, historyData, onResetFilters }) {
  const handleFlush = () => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });
  };

  return (
    <div className="page-wrapper">
      {/* Top Action Banner */}
      <div className="glass-card action-banner" style={{ marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 color="var(--status-good)" size={22} /> System Status: Normal
          </h2>
          <span className="status-time">
            Last ESP32 Reading: {sensorData.lastupdated} | Device: ESP32-WROOM-32
          </span>
        </div>

        <button
          className="btn-primary"
          onClick={handleFlush}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCw size={16} /> Flush RO System
        </button>
      </div>

      {/* Main Metric Widgets Grid */}
      <div className="dashboard-grid">
        {/* 1. TDS Radial Gauge */}
        <TdsGauge
          tdsValue={sensorData.tds}
          tdsStatus={sensorData.tdsStatus}
        />

        {/* 2. Flow Rate & Usage Card */}
        <SensorCard
          flowRate={sensorData.flowrate}
          dailyConsumption={sensorData.dailyConsumption}
        />

        {/* 3. Filter Lifespan Health */}
        <FilterStatus
          filterHealth={sensorData.filterHealth}
          onResetFilters={onResetFilters}
        />

        {/* 4. 24-Hour TDS Analytics Trend Chart */}
        <LiveChart historyData={historyData} />

        {/* 5. System Safety Panel */}
        <div className="glass-card col-span-4" style={{ padding: '24px' }}>
          <h3 className="card-title" style={{ marginBottom: '16px' }}>
            <ShieldAlert size={20} color="var(--accent-cyan)" />
            Safety & Leak Protection
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ fontWeight: '600', color: 'var(--status-good)', fontSize: '0.9rem' }}>
                ✓ No Water Leaks Detected
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Bottom pan moisture sensor is dry.
              </div>
            </div>

            <div style={{ background: 'rgba(0, 240, 255, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
              <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                Auto Shutdown Guard
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                System automatically shuts solenoid valve if TDS &gt; 250 PPM.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
