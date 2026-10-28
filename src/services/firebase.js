// ==========================================================================
// AquaGuard Firebase Realtime Database Service
// ==========================================================================
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { mock } from './mockData.js';

// 1. Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZd8MgygzXMpGS2NutDFkZ33C95NsyBEs",
  authDomain: "aquaguard-fee42.firebaseapp.com",
  databaseURL: "https://aquaguard-fee42-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aquaguard-fee42",
  storageBucket: "aquaguard-fee42.firebasestorage.app",
  messagingSenderId: "338379583476",
  appId: "1:338379583476:web:bf03b8f9bf1d3f3c7813a1"
};

// 2. Initialize Firebase App & Realtime Database
let app;
let database;

try {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
} catch (error) {
  console.warn("Firebase initialization error:", error);
}

/**
 * Subscribes to live sensor updates from Firebase Realtime Database.
 * Path: /aquaguard/sensors
 * @param {Function} onDataReceived Callback function when new sensor data arrives.
 * @returns {Function} Unsubscribe function to stop listening.
 */
export function subscribeToSensorData(onDataReceived) {
  if (!database) {
    const interval = setInterval(() => {
      onDataReceived(mock());
    }, 2500);

    return () => clearInterval(interval);
  }

  // Realtime Database Listener
  const sensorRef = ref(database, 'aquaguard/sensors');
  
  const unsubscribe = onValue(sensorRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      onDataReceived({
        tds: data.tds !== undefined ? data.tds : 45,
        tdsStatus: (data.tds || 45) < 50 ? 'Excellent' : 'Good',
        flowrate: parseFloat(data.flowrate !== undefined ? data.flowrate : 1.4),
        dailyConsumption: data.dailyConsumption !== undefined ? data.dailyConsumption : 14.2,
        filterHealth: data.filterHealth || {
          sediment: 92,
          carbon: 85,
          roMembrane: 78,
          uvLamp: 95
        },
        esp_Connected: true,
        lastupdated: data.lastupdated || new Date().toLocaleTimeString()
      });
    } else {
      // If path doesn't exist yet, fall back to mock data
      onDataReceived(mock());
    }
  }, (error) => {
    console.error("Firebase subscription error:", error);
    onDataReceived(mock());
  });

  return unsubscribe;
}
