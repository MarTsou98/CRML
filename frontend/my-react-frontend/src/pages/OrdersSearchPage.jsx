import React, { useState } from 'react';
import axios from 'axios';

const OrderSearchPage = () => {
  const [query, setQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const searchOrders = async () => {
    console.log("Searching for:", query);
    if (!query.trim()) {
      setOrders([]);
      setError('');
      return;
    }
console.log("Searching for:", query);
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${BASE_URL}/api/orders/search?q=${encodeURIComponent(query)}`);
      setOrders(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching orders');
      setOrders([]);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearchClick = () => {
    searchOrders();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchOrders();
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: 'auto' }}>
      <h2>Αναζήτηση Παραγγελιών</h2>

      <input
        type="text"
        placeholder="Αναζήτηση κατά πελάτη, πωλητή, εργολάβο ή άλλες λεπτομέρειες παραγγελίας..."
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
      />

      <button
        onClick={handleSearchClick}
        style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '1rem' }}
        disabled={loading}
      >
        {loading ? 'Searching...' : 'Search'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

      {!error && orders.length === 0 && !loading && <p style={{ marginTop: '1rem' }}>No orders found.</p>}

      {orders.length > 0 && (
        <table style={{ marginTop: '1rem', width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>ID Παραγγελίας</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Πελάτης</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Πωλητής</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Εργολάβος</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Τύπος Παραστατικού</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Τύπος Παραγγελίας</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Διαφορά</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Συνολικά Έσοδα</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{order._id}</td>
                <td style={{ padding: '0.5rem' }}>{order.customer_id?.firstName} {order.customer_id?.lastName}</td>
                <td style={{ padding: '0.5rem' }}>{order.salesperson_id?.name || '—'}</td>
                <td style={{ padding: '0.5rem' }}>{order.contractor_id?.name || '—'}</td>
                <td style={{ padding: '0.5rem' }}>{order.invoiceType}</td>
                <td style={{ padding: '0.5rem' }}>{order.orderType || '—'}</td>
                <td style={{ padding: '0.5rem' }}>${order.moneyDetails?.profit?.toLocaleString()}</td>
                <td style={{ padding: '0.5rem' }}>${order.moneyDetails?.timi_Polisis?.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderSearchPage;
