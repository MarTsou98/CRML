// src/pages/OrderByTypePage.jsx
import React from 'react';
import OrdersByType from '../components/OrdersByType'; // Adjust path as needed

const OrderByTypePage = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Παραγγελίες ανά Τύπο</h1>
      <OrdersByType />
    </div>
  );
};

export default OrderByTypePage;
