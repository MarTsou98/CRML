import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import SmallCustomerPreview from '../components/SmallCustomerPreview';
import CustomerSearchBar from '../components/CustomerSearchBar';
import './css/SearchCustomer.css';

const SearchCustomer = () => {
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleResults = (data, searchStatus) => {
    setResults(data);
    setHasSearched(searchStatus);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <BackButton />
      <h2>Αναζήτηση Πελάτη</h2>

      <CustomerSearchBar onResults={handleResults} />

      {!results.length && hasSearched && (
        <p>Δεν βρέθηκαν αποτελέσματα.</p>
      )}

      {results.length > 0 && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {results.map((customer) => (
            <SmallCustomerPreview key={customer._id} customer={customer} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchCustomer;
