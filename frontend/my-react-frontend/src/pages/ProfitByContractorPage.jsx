// src/pages/ProfitByContractorPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfitList from '../components/ProfitList';
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const ProfitByContractorPage = () => {
  const [contractors, setContractors] = useState([]);
  const [allProfits, setAllProfits] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [error, setError] = useState('');

  // 1. Load all contractors
  useEffect(() => {
    axios.get(`${BASE_URL}/api/contractors/all`)
      .then(res => setContractors(res.data))
      .catch(() => setError('Failed to load contractors.'));
  }, []);

  // 2. Load all profit-by-contractor data once
  useEffect(() => {
    axios.get(`${BASE_URL}/api/stats/profit-by-contractor`)
      .then(res => setAllProfits(res.data))
      .catch(() => setError('Failed to load profit data.'));
  }, []);

  // 3. Find the selected contractor’s profit entry
  const selectedProfit = allProfits.find(p => p.contractorId === selectedId);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h2>Profit by Contractor</h2>

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

      {selectedId ? (
        selectedProfit
          ? <ProfitList title={`Profit for ${selectedProfit.name}`} data={[selectedProfit]} />
          : <p>No profit data found for this contractor.</p>
      ) : (
        <p>Please select a contractor to view their profit.</p>
      )}
    </div>
  );
};

export default ProfitByContractorPage;
