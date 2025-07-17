// src/components/OrdersByType.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer
} from 'recharts';
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57'];

const OrdersByType = () => {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/stats/orders-by-type`)
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch order data');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const chartData = Object.keys(orders)
    .filter(key => key !== 'total')
    .map((company, index) => ({
      name: company,
      count: orders[company].count,
      revenue: orders[company].totalRevenue,
      profit: orders[company].totalProfit,
      color: COLORS[index % COLORS.length]
    }));
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const { count, revenue, profit } = payload[0].payload;
    return (
      <div style={{
        background: 'white',
        border: '1px solid #ccc',
        padding: '0.75rem',
        borderRadius: '0.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <p><strong>{label}</strong></p>
        <p>🧾 Αριθμός παραγγελιών: {count}</p>
        <p>💰 Συνολικά Έσοδα: ${revenue.toLocaleString()}</p>
        <p>📈 Συνολική Διαφορά: ${profit.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📊 Αριθμός Παραγγελιών ανά Εταιρεία</h2>

      {/* Bar Chart */}
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip content={<CustomTooltip />} />
  <Bar dataKey="count">
    {chartData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={entry.color} />
    ))}
  </Bar>
</BarChart>

        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div style={{ width: '100%', height: 300, marginTop: '2rem' }}>
        <ResponsiveContainer>
          <PieChart>
  <Pie
    data={chartData}
    dataKey="count"
    nameKey="name"
    cx="50%"
    cy="50%"
    outerRadius={100}
    fill="#8884d8"
    label
  >
    {chartData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={entry.color} />
    ))}
  </Pie>
  <Legend />
  <Tooltip content={<CustomTooltip />} />
</PieChart>

        </ResponsiveContainer>
      </div>

      <hr />
      <h3>Συνολικές Παραγγελίες: {orders.total.count}</h3>
      <h4>Συνολικά Έσοδα: ${orders.total.totalRevenue.toLocaleString()}</h4>
      <h4>Συνολική Διαφορά: ${orders.total.totalProfit.toLocaleString()}</h4>
    </div>
  );
};

export default OrdersByType;
