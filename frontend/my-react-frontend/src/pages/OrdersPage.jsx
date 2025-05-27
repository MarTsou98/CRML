import React, { useEffect, useState } from 'react';
import SmallOrderPreview from '../components/SmallOrderPreview';
import axios from 'axios';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;
  const salespersonId = user?.salesperson_id;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        let res;

        if (role === 'manager') {
          res = await axios.get('http://localhost:5000/api/orders/');
        } else if (role === 'salesperson' && salespersonId) {
          res = await axios.get(`http://localhost:5000/api/orders/salesperson/${salespersonId}`);
        } else {
          throw new Error('Unauthorized or missing user data.');
        }

        setOrders(res.data);
      } catch (err) {
        setError('Failed to load orders.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [role, salespersonId]);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Orders {role === 'manager' ? 'for All Salespersons' : 'for You'}</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => <SmallOrderPreview key={order._id} order={order} />)
      )}
    </div>
  );
};

export default OrdersPage;
