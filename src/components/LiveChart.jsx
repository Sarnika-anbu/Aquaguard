import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp } from 'lucide-react';

// Register Chart.js elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function LiveChart({ historyData }) {
  const data = {
    labels: historyData.times,
    datasets: [
      {
        label: 'TDS Level (PPM)',
        data: historyData.tdsValues,
        borderColor: '#00f0ff',
        backgroundColor: 'rgba(0, 240, 255, 0.1)',
        fill: true,
        tension: 0.4, // Smooth curved line
        pointBackgroundColor: '#00f0ff',
        pointRadius: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#0d152d',
        titleColor: '#f8fafc',
        bodyColor: '#00f0ff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' },
        min: 20,
        max: 80
      }
    }
  };

  return (
    <div className="glass-card col-span-8" style={{ padding: '24px' }}>
      <div className="card-header">
        <h3 className="card-title">
          <TrendingUp size={20} color="var(--accent-cyan)" />
          24-Hour TDS Analytics Trend
        </h3>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Target: &lt; 50 PPM
        </span>
      </div>

      <div style={{ height: '260px', marginTop: '12px' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
