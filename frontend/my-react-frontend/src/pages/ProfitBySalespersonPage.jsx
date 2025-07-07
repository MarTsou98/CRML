// src/pages/ProfitBySalespersonPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfitList from '../components/ProfitList';

const ProfitBySalespersonPage = () => {
  const [salespeople, setSalespeople] = useState([]);
  const [allProfits, setAllProfits] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [error, setError] = useState('');

  // 1. Load all salespeople (for the dropdown)
  useEffect(() => {
    axios.get('http://localhost:5000/api/salespeople/all')
      .then(res => setSalespeople(res.data))
      .catch(() => setError('Failed to load salespeople.'));
  }, []);

  // 2. Load all profit data once
  useEffect(() => {
    axios.get('http://localhost:5000/api/stats/profit-by-salesperson')
      .then(res => setAllProfits(res.data))
      .catch(() => setError('Failed to load profit data.'));
  }, []);

  // 3. Find the selected profit entry
  const selectedProfit = allProfits.find(p => p.salespersonId === selectedId);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h2>Profit by Salesperson</h2>

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

      {selectedProfit
        ? <ProfitList title={`Profit for ${selectedProfit.name}`} data={[selectedProfit]} />
        : selectedId
          ? <p>No profit data found for this salesperson.</p>
          : <p>Please select a salesperson to view their profit.</p>
      }
    </div>
  );
};

export default ProfitBySalespersonPage;
