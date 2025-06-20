import React, { useState } from 'react';
import axios from 'axios';
import BackButton from '../components/BackButton';
import SmallCustomerPreview from '../components/SmallCustomerPreview'; // ✅ import your preview
import './css/SearchCustomer.css';

const SearchCustomer = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
    const salespersonId = user?.salesperson_id;
    const role = user?.role;
 const handleSearch = async () => {
  if (!query.trim()) {
    setError('Please enter a name, email, or phone number');
    return;
  }
setLoading(true);
  setError('');
  setHasSearched(true);
  try {
    const res = await axios.get('http://localhost:5000/api/customers/search', {
      params: { query },
    });

    // ✅ Manager sees all, others filtered
    const filteredResults = role === 'manager'
      ? res.data
      : res.data.filter(
          (customer) => customer.id_of_salesperson?._id === salespersonId
        );

    setResults(filteredResults);
  } catch (err) {
    console.error('Search failed:', err);
    setError('Something went wrong while searching');
    setResults([]);
  } finally {
    setLoading(false);
  }
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <BackButton />
      <h2>Αναζήτηση Πελάτη</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="text"
           className="search-input"
          placeholder="Αναζήτηση με όνομα, email ή τηλέφωνο"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          style={{ flexGrow: 1 }}
        />
        <button onClick={handleSearch} className="search-button">Αναζήτηση</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && hasSearched && results.length === 0 && !error && <p>Δεν βρέθηκαν αποτελέσματα.</p>}
      {!loading && results.length > 0 && (
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
