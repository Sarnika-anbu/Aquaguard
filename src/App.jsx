import React, { useState, useEffect } from 'react';
import OpeningIntro from './components/OpeningIntro.jsx';
import Navbar from './components/Navbar.jsx';
import LandingPage from './pages/LandingPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { mock, getInitialHistory } from './services/mockData.js';
import { subscribeToSensorData } from './services/firebase.js';
import './styles/dashboard.css';

export default function App() {
  // 1. App Navigation & Splash State
  const [showIntro, setShowIntro] = useState(true);
  const [currentView, setCurrentView] = useState('landing');

  // 2. Sensor & History State
  const [sensorData, setSensorData] = useState(mock());
  const [historyData, setHistoryData] = useState(getInitialHistory());

  // 3. Live Data Listener (Firebase Realtime Database with Mock Fallback)
  useEffect(() => {
    const unsubscribe = subscribeToSensorData((data) => {
      setSensorData(data);
    });

    return () => unsubscribe();
  }, []);

  // 4. Reset Filters Handler
  const handleResetFilters = () => {
    setSensorData(prev => ({
      ...prev,
      filterHealth: {
        sediment: 100,
        carbon: 100,
        roMembrane: 100,
        uvLamp: 100
      }
    }));
  };

  return (
    <div className="app-container">
      {/* Opening Liquid Splash Screen */}
      {showIntro && (
        <OpeningIntro onComplete={() => setShowIntro(false)} />
      )}

      {/* Main Top Navigation Header */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        espConnected={sensorData.esp_Connected}
      />

      {/* Page Routing/View Switch */}
      {currentView === 'landing' ? (
        <LandingPage
          sensorData={sensorData}
          onLaunchDashboard={() => setCurrentView('dashboard')}
        />
      ) : (
        <Dashboard
          sensorData={sensorData}
          historyData={historyData}
          onResetFilters={handleResetFilters}
        />
      )}
    </div>
  );
}
