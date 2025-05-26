import React from 'react';
import { Link } from 'react-router-dom';

function SmallOrderPreview({ order }) {
  return (
    <div style={{ border: '1px solid #aaa', padding: '8px', marginBottom: '8px', borderRadius: '5px' }}>
      <p><strong>Customer:</strong> {order.customer_id?.firstName} {order.customer_id?.lastName}</p>
      <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
      <p><strong>Timi Polisis:</strong> €{order.moneyDetails?.timi_Polisis}</p>
      <Link to={`/orders/${order._id}`}>
        <button>View Details</button>
      </Link>
    </div>
  );
}

export default SmallOrderPreview;
