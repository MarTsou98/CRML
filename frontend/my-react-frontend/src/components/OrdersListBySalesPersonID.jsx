import React, { useState, useEffect } from 'react';
import SmallOrderPreview from './SmallOrderPreview';
import BigOrderPreview from './BigOrderPreview';
import { fetchOrdersBySalespersonId } from '../api/orders_bySalesPersonID';
import { Link } from 'react-router-dom';



function OrdersList({ salespersonId }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrdersBySalespersonId(salespersonId)
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [salespersonId]);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  // Show big preview if an order is selected
  if (selectedOrder) {
    return <BigOrderPreview order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
  }

  // Otherwise, show small previews list
  return (
    <div>
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map(order => (
          <SmallOrderPreview
            key={order._id}
            order={order}
            onViewDetails={setSelectedOrder}
          />
        ))
      )}
    </div>
  );
}

export default OrdersList;
