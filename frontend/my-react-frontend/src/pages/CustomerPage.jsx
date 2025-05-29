// src/pages/NewOrderPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton'; // Adjust the path if needed
function CustomerPage() {
  return (
    <div>
      <BackButton />
      <h1>Customer Page</h1>
      <p>This is where the customer details will be shown.</p>
    </div>
  );
}

export default CustomerPage;