import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';

const OrdersByContractorPage = () => {
  const [contractors, setContractors] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  // Fetch all contractors on mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/contractors/all')
      .then(res => setContractors(res.data))
      .catch(err => {
        console.error('Error fetching contractors:', err);
        setError('Failed to load contractors.');
      });
  }, []);

  const fetchStats = async () => {
    try {
      setError('');
      setData(null);

      const response = await axios.get(`http://localhost:5000/api/stats/Type-Of-orders-by-contractors/${selectedId}`);
      const resData = response.data;

      const chartData = Object.entries(resData)
        .filter(([key]) => key !== 'total')
        .map(([company, count]) => ({ company, count }));

      setData(chartData);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error fetching data');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h2>Παραγγελίες ανά Συνεργάτη</h2>

      <div style={{ marginBottom: '1rem' }}>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          style={{ padding: '0.5rem', width: '300px' }}
        >
          <option value="">-- Επιλέξτε Συνεργάτη --</option>
          {contractors.map(contractor => (
            <option key={contractor._id} value={contractor._id}>
              {contractor.firstName && contractor.lastName
                ? `${contractor.firstName} ${contractor.lastName}`
                : contractor.name || 'Unknown'}
            </option>
          ))}
        </select>

        <button
          onClick={fetchStats}
          disabled={!selectedId}
          style={{
            marginLeft: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#0077cc',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: selectedId ? 'pointer' : 'not-allowed'
          }}
        >
          Προβολή Στατιστικών
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="company" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#00aa88" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        data && <p>Δεν βρέθηκαν δεδομένα για αυτόν τον συνεργάτη.</p>
      )}
    </div>
  );
};

export default OrdersByContractorPage;
