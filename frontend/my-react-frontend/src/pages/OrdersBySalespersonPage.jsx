import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const OrdersBySalespersonPage = () => {
  const [salespeople, setSalespeople] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  // Fetch all salespeople once
  useEffect(() => {
    axios.get(`${BASE_URL}/api/salespeople/all`)
      .then(res => setSalespeople(res.data))
      .catch(err => {
        console.error('Error fetching salespeople:', err);
        setError('Failed to load salespeople.');
      });
  }, []);

  const fetchStats = async () => {
    try {
      setError('');
      setData(null);

      const response = await axios.get(`${BASE_URL}/api/stats/Type-Of-orders-by-salesperson/${selectedId}`);
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
    <div style={{ padding: '2rem' }}>
      <h2>Παραγγελείες Πωλητή ανά Εταιρεία</h2>

      {/* Dropdown instead of free-text ID */}
      <div style={{ marginBottom: '1rem' }}>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          style={{ padding: '0.5rem', width: '300px' }}
        >
          <option value="">-- Επιλέξτε Πωλητή --</option>
          {salespeople.map(sp => (
            <option key={sp._id} value={sp._id}>
              {sp.firstName} {sp.lastName}
            </option>
          ))}
        </select>

        <button
          onClick={fetchStats}
          disabled={!selectedId}
          style={{
            marginLeft: '1rem',
            padding: '0.5rem 1rem',
            cursor: selectedId ? 'pointer' : 'not-allowed'
          }}
        >
          Εύρεση Στατιστικών
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
            <Bar dataKey="count" fill="#0077cc" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        data && <p>Δεν βρέθηκαν δεδομένα για αυτόν τον πωλητή.</p>
      )}
    </div>
  );
};

export default OrdersBySalespersonPage;
