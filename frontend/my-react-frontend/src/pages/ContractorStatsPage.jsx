// src/pages/ContractorStatsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ContractorStatsPage = () => {
  const { id } = useParams();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/stats/contractor/${id}`);
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch contractor stats');
      }
    };

    fetchStats();
  }, [id]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🏗️ Contractor Stats</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {stats ? (
        <ul style={{ fontSize: '1.2rem', lineHeight: '2' }}>
          <li><strong>Name:</strong> {stats.name}</li>
          <li><strong>Email:</strong> {stats.email}</li>
          <li><strong>Total Orders:</strong> {stats.totalOrders.toLocaleString()}</li>
          <li><strong>Total Revenue:</strong> ${stats.totalRevenue.toLocaleString()}</li>
          <li><strong>Total Profit:</strong> ${stats.totalProfit.toLocaleString()}</li>
        </ul>
      ) : (
        !error && <p>Loading...</p>
      )}
    </div>
  );
};

export default ContractorStatsPage;
