// src/components/OrdersByType.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57'];

const OrdersByType = () => {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
   axios.get('http://localhost:5000/api/stats/orders-by-type')// Adjust as needed
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
      value: orders[company],
      color: COLORS[index % COLORS.length]
    }));

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Order Counts by Company</h2>

      {/* Bar Chart */}
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value">
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
              dataKey="value"
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
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <hr />
      <h3>Total Orders: {orders.total}</h3>
    </div>
  );
};

export default OrdersByType;
