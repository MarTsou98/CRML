import React from 'react';
import { Link } from 'react-router-dom';
import './css/SmallCustomerPreview.css';

const SmallCustomerPreview = ({ customer }) => {
  return (
    <div className="small-customer-preview">
      <p><strong>Όνομα:</strong> {customer.firstName} {customer.lastName}</p>	
      <p><strong>Email:</strong> {customer.email}</p>
      <p><strong>Τηλέφωνο:</strong> {customer.phone}</p>
      <Link to={`/customers/${customer._id}`}>
        <button>Δείτε Λεπτομέρειες</button>
      </Link>
    </div>
  );
};

export default SmallCustomerPreview;
