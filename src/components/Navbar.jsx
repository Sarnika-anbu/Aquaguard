import React from 'react';
import { Droplet, Activity, LayoutDashboard, Home } from 'lucide-react';

export default function Navbar({ currentView, setCurrentView, espConnected }) {
  return (
    <nav className="navbar">
      {/* Brand Logo */}
      <a href="#" className="nav-brand" onClick={() => setCurrentView('landing')}>
        <Droplet className="brand-icon" size={28} />
        <span>AquaGuard</span>
      </a>

      {/* Center Navigation Links & ESP32 Status */}
      <div className="nav-controls">
        <button
          className={`nav-link ${currentView === 'landing' ? 'active' : ''}`}
          onClick={() => setCurrentView('landing')}
        >
          <Home size={16} style={{ display: 'inline', marginRight: '6px' }} />
          Home
        </button>

        <button
          className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentView('dashboard')}
        >
          <LayoutDashboard size={16} style={{ display: 'inline', marginRight: '6px' }} />
          Live Dashboard
        </button>

        {/* ESP32 Hardware Status Badge */}
        <div className="esp-status-pill">
          <div className="status-dot pulse-badge"></div>
          <span>{espConnected ? 'ESP32 Live' : 'ESP32 Offline'}</span>
        </div>
      </div>
    </nav>
  );
}
