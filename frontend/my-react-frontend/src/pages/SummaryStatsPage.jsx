// src/pages/SummaryStatsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const SummaryStatsPage = () => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/stats/summary`);
        setSummary(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch summary');
      }
    };

    fetchSummary();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📊 Συνολικά Στατιστικά</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {summary ? (
        <ul style={{ fontSize: '1.2rem', lineHeight: '2' }}>
          <li><strong>Συνολικές Παραγγελίες:</strong> {summary.totalOrders.toLocaleString()}</li>
          <li><strong>Συνολικά Έσοδα:</strong> ${summary.totalRevenue.toLocaleString()}</li>
          <li><strong>Συνολική Διαφορά:</strong> ${summary.totalProfit.toLocaleString()}</li>
        </ul>
      ) : (
        !error && <p>Loading...</p>
      )}
    </div>
  );
};

export default SummaryStatsPage;
