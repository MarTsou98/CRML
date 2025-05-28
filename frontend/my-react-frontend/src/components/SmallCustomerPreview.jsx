import React from 'react';
import { Link } from 'react-router-dom';

const SmallCustomerPreview = ({ customer }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '6px' }}>
      <p><strong>Name:</strong> {customer.firstName} {customer.lastName}</p>
      <p><strong>Email:</strong> {customer.email}</p>
      <p><strong>Phone:</strong> {customer.phone}</p>
      <Link to={`/customers/${customer._id}`}>
        <button>View Details</button>
      </Link>
    </div>
  );
};

export default SmallCustomerPreview;
