import React from 'react';
import { Droplet, Shield, Bell, Smartphone, ArrowRight, Play } from 'lucide-react';

export default function LandingPage({ sensorData, onLaunchDashboard }) {
  return (
    <div className="page-wrapper">
      {/* 1. Hero Section */}
      <section className="hero-container">
        <div>
          <h1 className="hero-title">
            Pure Water,<br />
            <span className="hero-highlight">Intelligently Monitored</span>
          </h1>
          <p className="hero-description">
            AquaGuard connects directly to your ESP32 RO water purifier. Monitor live TDS purity, water flow rates, and filter health percentages right from your browser.
          </p>

          <div className="hero-actions">
            <button className="btn-primary" onClick={onLaunchDashboard} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Launch Live Dashboard <ArrowRight size={18} />
            </button>
            <button className="btn-secondary" onClick={onLaunchDashboard} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Play size={16} /> View Demo Stream
            </button>
          </div>
        </div>

        {/* 2. Interactive Live Preview Card */}
        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: '600' }}>
              ● LIVE ESP32 SENSOR FEED
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {sensorData.lastupdated}
            </span>
          </div>

          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--accent-cyan)', lineHeight: '1' }}>
              {sensorData.tds} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>PPM</span>
            </div>
            <div style={{ color: 'var(--status-good)', fontSize: '0.95rem', fontWeight: '600', marginTop: '8px' }}>
              Water Status: {sensorData.tdsStatus} (Safe Drinking Water)
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid var(--border-glass)', paddingTop: '20px' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Flow Rate</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '700' }}>{sensorData.flowrate} L/min</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>RO Filter Life</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                {sensorData.filterHealth.roMembrane}%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Feature Pillars Grid */}
      <section className="feature-grid">
        <div className="glass-card feature-card">
          <div className="feature-icon">
            <Droplet size={24} />
          </div>
          <h3 className="feature-title">Real-Time Purity</h3>
          <p className="feature-desc">
            Instantly measure Total Dissolved Solids (TDS) PPM levels in real time as water passes through your RO membrane.
          </p>
        </div>

        <div className="glass-card feature-card">
          <div className="feature-icon">
            <Shield size={24} />
          </div>
          <h3 className="feature-title">Smart Filter Health</h3>
          <p className="feature-desc">
            Track individual lifespan percentages for Sediment, Carbon, RO, and UV filters with replacement alerts.
          </p>
        </div>

        <div className="glass-card feature-card">
          <div className="feature-icon">
            <Bell size={24} />
          </div>
          <h3 className="feature-title">Leak & Overflow Alerts</h3>
          <p className="feature-desc">
            Receive instant safety notifications when abnormal water flow or leakage is detected by the ESP32.
          </p>
        </div>

        <div className="glass-card feature-card">
          <div className="feature-icon">
            <Smartphone size={24} />
          </div>
          <h3 className="feature-title">Cross Platform</h3>
          <p className="feature-desc">
            Responsive design tailored for mobile phones, tablets, and desktop displays with smooth animations.
          </p>
        </div>
      </section>
    </div>
  );
}
