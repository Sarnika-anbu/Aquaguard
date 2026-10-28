// ==========================================================================
// AquaGuard ESP32 Data Simulation Service
// ==========================================================================

/**
 * Generates a realistic live sensor reading from an imaginary ESP32.
 * @returns {Object} Sensor reading object with TDS, Flow Rate, and Filter Life.
 */
export function mock() {
  // 1. Generate a random TDS level between 38 PPM and 58 PPM (Safe RO Water range)
  const tds = Math.floor(Math.random() * (58 - 38 + 1)) + 38;
  
  // 2. Generate a random flow rate between 1.1 L/min and 1.8 L/min
  const flow = (Math.random() * (1.8 - 1.1) + 1.1).toFixed(1);

  return {
    tds: tds,
    tdsStatus: tds < 50 ? 'Excellent' : 'Good',
    flowrate: parseFloat(flow),
    dailyConsumption: 14.2, // Total Liters used today
    filterHealth: {
      sediment: 92,   // Sediment Pre-Filter %
      carbon: 85,     // Activated Carbon %
      roMembrane: 78, // RO Membrane %
      uvLamp: 95      // UV Disinfection Lamp %
    },
    esp_Connected: true,
    lastupdated: new Date().toLocaleTimeString()
  };
}

/**
 * Generates initial 24-hour historical data points for Chart.js
 */
export function getInitialHistory() {
  const times = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
  const tdsValues = [42, 45, 40, 48, 43, 46, 44, 42];
  return { times, tdsValues };
}
