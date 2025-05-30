import React from 'react';
import { Link } from 'react-router-dom';
import './css/SmallOrderPreview.css';

function SmallOrderPreview({ order }) {
  return (
    <div className="small-order-preview">
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
