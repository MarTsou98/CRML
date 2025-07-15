import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SmallCustomerPreview from '../components/SmallCustomerPreview';
import BackButton from '../components/BackButton'; // Adjust the path if needed

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5;

  useEffect(() => {
    const fetchCustomers = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const salespersonId = user?.salesperson_id;

      try {
        if(user.role === 'manager') {
          const res = await axios.get(`${BASE_URL}/api/customers/all`);
          setCustomers(res.data);
        } else if (user.role === 'salesperson') {
          const res = await axios.get(`${BASE_URL}/api/customers/salesperson/${salespersonId}`);
          setCustomers(res.data);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch customers.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) return <p>Loading customers...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  // Pagination logic
  const indexOfLast = currentPage * customersPerPage;
  const indexOfFirst = indexOfLast - customersPerPage;
  const currentCustomers = customers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(customers.length / customersPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  return (
    <div style={{  padding: '1rem', display: 'flex', justifyContent: 'center' }}>
       <div style={{ maxWidth: '800px', width: '100%' }}>
      <BackButton />
      <h2>Οι πελάτες σου</h2>
      {currentCustomers.length === 0 ? (
        <p>Δεν βρέθηκαν πελάτες.</p>
      ) : (
        currentCustomers.map((customer) => (
          <SmallCustomerPreview key={customer._id} customer={customer} />
        ))
      )}

      {/* Pagination Controls */}
      {customers.length > customersPerPage && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', gap: '1rem' }}>
          <button onClick={handlePrev} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={handleNext} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
    </div>
  );
};

export default CustomersPage;
