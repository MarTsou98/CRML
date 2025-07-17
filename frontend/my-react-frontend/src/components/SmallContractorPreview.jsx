// src/components/SmallContractorPreview.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './css/SmallContractorPreview.css'; // create styles similar to SmallCustomerPreview.css

const SmallContractorPreview = ({ contractor }) => {
  return (
    <div className="small-contractor-preview">
      <p><strong>Επωνυμία:</strong> {contractor.EnterpriseName}</p>
      {/* Adjust or remove email and phone if they don’t exist */}
      <p><strong>Email:</strong> {contractor.email || 'N/A'}</p>
      <p><strong>Τηλέφωνο:</strong> {contractor.phone || 'N/A'}</p>
      <Link to={`/contractors/${contractor._id}`}>
        <button>Δείτε Λεπτομέρειες</button>
      </Link>
    </div>
  );
};

export default SmallContractorPreview;
