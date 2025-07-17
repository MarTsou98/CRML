// src/pages/SalespersonStatsPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const SalespersonStatsPage = () => {
  const [salespeople, setSalespeople] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loadingStats, setLoadingStats] = useState(false);

  // 1. Load list of salespeople for the dropdown
  useEffect(() => {
    axios.get(`${BASE_URL}/api/salespeople/all`)
      .then(res => setSalespeople(res.data))
      .catch(err => {
        console.error('Error loading salespeople:', err);
        setError('Failed to load salespeople.');
      });
  }, []);

  // 2. Whenever selectedId changes, fetch that salesperson's stats
  useEffect(() => {
    if (!selectedId) {
      setStats(null);
      return;
    }

    const fetchStats = async () => {
      setError('');
      setLoadingStats(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/stats/salesperson/${selectedId}`);
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err.response?.data?.message || 'Failed to fetch stats.');
        setStats(null);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [selectedId]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h2>👤 Στατιστικά Πωλητή</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ margin: '1rem 0' }}>
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          style={{ padding: '0.5rem', width: '300px' }}
        >
          <option value="">-- Select a Salesperson --</option>
          {salespeople.map(sp => (
            <option key={sp._id} value={sp._id}>
              {sp.firstName} {sp.lastName}
            </option>
          ))}
        </select>
      </div>

      {!selectedId && <p>Παρακαλώ επιλέξτε έναν πωλητή για να δείτε τα στατιστικά του.</p>}

      {loadingStats && <p>Φόρτωση στατιστικών…</p>}

      {stats && !loadingStats && (
        <ul style={{ fontSize: '1.1rem', lineHeight: '1.8', marginTop: '1rem' }}>
          <li><strong>Name:</strong> {stats.name}</li>
          <li>
            <strong>Συνολικές Παραγγελίες:</strong>{' '}
            {(stats.orderCount ?? 0).toLocaleString()}
          </li>
          <li>
            <strong>Συνολικά Έσοδα:</strong>{' '}
            ${ (stats.totalRevenue ?? 0).toLocaleString() }
          </li>
          <li>
            <strong>Συνολική Διαφορά:</strong>{' '}
            ${ (stats.totalProfit ?? 0).toLocaleString() }
          </li>
        </ul>
      )}
    </div>
  );
};

export default SalespersonStatsPage;
