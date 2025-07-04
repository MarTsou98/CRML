// src/pages/SalespersonStatsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SalespersonStatsPage = () => {
  const { id } = useParams();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/stats/salesperson/${id}`);
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch stats');
      }
    };

    fetchStats();
  }, [id]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>👤 Salesperson Stats</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {stats ? (
        <ul style={{ fontSize: '1.2rem', lineHeight: '2' }}>
          <li><strong>Name:</strong> {stats.name}</li>
          
            <li><strong>Total Orders:</strong> {(stats.orderCount ?? 0).toLocaleString()}</li>
            <li><strong>Total Revenue:</strong> ${ (stats.totalRevenue ?? 0).toLocaleString() }</li>
            <li><strong>Total Profit:</strong> ${ (stats.totalProfit ?? 0).toLocaleString() }</li>

        </ul>
      ) : (
        !error && <p>Loading...</p>
      )}
    </div>
  );
};

export default SalespersonStatsPage;
