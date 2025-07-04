import React, { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const OrdersBySalespersonPage = () => {
  const [salespersonId, setSalespersonId] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setError('');
      const response = await axios.get(`http://localhost:5000/api/stats/Type-Of-orders-by-salesperson/${salespersonId}`);
      const resData = response.data;

      // Convert response into array format for recharts
      const chartData = Object.entries(resData)
        .filter(([key]) => key !== 'total')
        .map(([company, count]) => ({ company, count }));

      setData(chartData);
    } catch (err) {
      setData(null);
      setError(err.response?.data?.message || 'Error fetching data');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Orders by Salesperson</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Enter Salesperson ID"
          value={salespersonId}
          onChange={(e) => setSalespersonId(e.target.value)}
          style={{ padding: '0.5rem', width: '300px' }}
        />
        <button onClick={fetchStats} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
          Fetch Stats
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
        data && <p>No data found for this salesperson.</p>
      )}
    </div>
  );
};

export default OrdersBySalespersonPage;
