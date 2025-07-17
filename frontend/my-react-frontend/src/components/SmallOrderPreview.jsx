import React from 'react';
import { Link } from 'react-router-dom';
import './css/SmallOrderPreview.css';

function SmallOrderPreview({ order }) {
  return (
    <div className="small-order-preview">
      <p><strong>Πελάτης:</strong> {order.customer_id?.firstName} {order.customer_id?.lastName}</p>
      <p><strong>Ημερομηνία:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
      <p><strong>Τιμή Πώλησης:</strong> €{order.moneyDetails?.timi_Polisis}</p>
      <p><strong>Εταιρεία:</strong> {order.orderedFromCompany}</p>
      <Link to={`/orders/${order._id}`}>
        <button>Δείτε Λεπτομέρειες</button>
      </Link>
    </div>
  );
}

export default SmallOrderPreview;
