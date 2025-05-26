// src/components/OrderDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOrderById } from '../api';

function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderById(orderId)
      .then(data => {
        setOrder(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [orderId]);

  if (loading) return <p>Loading order details...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!order) return <p>No order found.</p>;

  return (
    <div>
      <h2>Order Details</h2>
      <p><strong>Customer:</strong> {order.customer_id?.firstName} {order.customer_id?.lastName}</p>
      <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
      <p><strong>Timi Polisis:</strong> €{order.moneyDetails?.timi_Polisis}</p>
      {/* Add more detailed fields as you want here */}
    </div>
  );
}

export default OrderDetail;
