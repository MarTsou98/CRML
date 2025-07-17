import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SmallCustomerPreview from '../components/SmallCustomerPreview';
import BackButton from '../components/BackButton';
import CustomerSearchBar from '../components/CustomerSearchBar'; // ✅ import the search bar

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]); // ✅ search results (optional)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5;

  useEffect(() => {
    const fetchCustomers = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const salespersonId = user?.salesperson_id;

      try {
        let res;
        if (user.role === 'manager') {
          res = await axios.get(`${BASE_URL}/api/customers/all`);
        } else if (user.role === 'salesperson') {
          res = await axios.get(`${BASE_URL}/api/customers/salesperson/${salespersonId}`);
        }

        setCustomers(res.data);
        setFiltered(res.data); // ✅ default is unfiltered
      } catch (err) {
        console.error(err);
        setError('Failed to fetch customers.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleSearchResults = (results, hasSearched) => {
    setFiltered(results);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Pagination logic (based on filtered results)
  const indexOfLast = currentPage * customersPerPage;
  const indexOfFirst = indexOfLast - customersPerPage;
  const currentCustomers = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / customersPerPage);

  const handlePrev = () => currentPage > 1 && setCurrentPage((p) => p - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage((p) => p + 1);

  if (loading) return <p>Loading customers...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <BackButton />
        <h2>Οι πελάτες σου</h2>

        {/* ✅ Inject Search Bar */}
        <CustomerSearchBar onResults={handleSearchResults} />

        {currentCustomers.length === 0 ? (
          <p>Δεν βρέθηκαν πελάτες.</p>
        ) : (
          currentCustomers.map((customer) => (
            <SmallCustomerPreview key={customer._id} customer={customer} />
          ))
        )}

        {/* Pagination Controls */}
        {filtered.length > customersPerPage && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', gap: '1rem' }}>
            <button onClick={handlePrev} disabled={currentPage === 1}>
              Προηγούμενη
            </button>
            <span>Σελίδα {currentPage} από {totalPages}</span>
            <button onClick={handleNext} disabled={currentPage === totalPages}>
              Επόμενη
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomersPage;
