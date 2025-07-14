// src/pages/ContractorStatsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const ContractorStatsPage = () => {
  const [contractors, setContractors] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loadingStats, setLoadingStats] = useState(false);

  // 1. Load all contractors for the dropdown
  useEffect(() => {
    axios.get(`${BASE_URL}/api/contractors/all`)
      .then(res => setContractors(res.data))
      .catch(err => {
        console.error('Error fetching contractors:', err);
        setError('Failed to load contractors.');
      });
  }, []);

  // 2. Fetch stats whenever selectedId changes
  useEffect(() => {
    if (!selectedId) {
      setStats(null);
      return;
    }

    setError('');
    setLoadingStats(true);

    axios.get(`${BASE_URL}/api/stats/contractor/${selectedId}`)
      .then(res => setStats(res.data))
      .catch(err => {
        console.error('Error fetching contractor stats:', err);
        setError(err.response?.data?.message || 'Failed to fetch stats.');
        setStats(null);
      })
      .finally(() => setLoadingStats(false));
  }, [selectedId]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h2>🏗️ Contractor Stats</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ margin: '1rem 0' }}>
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          style={{ padding: '0.5rem', width: '300px' }}
        >
          <option value="">-- Select a Contractor --</option>
          {contractors.map(c => (
            <option key={c._id} value={c._id}>
              {c.firstName && c.lastName
                ? `${c.firstName} ${c.lastName}`
                : c.name || 'Unnamed Contractor'}
            </option>
          ))}
        </select>
      </div>

      {!selectedId && <p>Please select a contractor to view their stats.</p>}

      {loadingStats && <p>Loading stats…</p>}

      {stats && !loadingStats && (
        <ul style={{ fontSize: '1.1rem', lineHeight: '1.8', marginTop: '1rem' }}>
          <li><strong>Name:</strong> {stats.name}</li>
          {stats.email && <li><strong>Email:</strong> {stats.email}</li>}
          <li>
            <strong>Total Orders:</strong>{' '}
            {(stats.totalOrders ?? 0).toLocaleString()}
          </li>
          <li>
            <strong>Total Revenue:</strong>{' '}
            ${ (stats.totalRevenue ?? 0).toLocaleString() }
          </li>
          <li>
            <strong>Total Profit:</strong>{' '}
            ${ (stats.totalProfit ?? 0).toLocaleString() }
          </li>
        </ul>
      )}
    </div>
  );
};

export default ContractorStatsPage;
