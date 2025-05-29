import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SmallCustomerPreview from '../components/SmallCustomerPreview';
import BackButton from '../components/BackButton'; // Adjust the path if needed
const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const salespersonId = user?.salesperson_id;

      if (!salespersonId) {
        setError('Salesperson ID missing.');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/customers/salesperson/${salespersonId}`);
        setCustomers(res.data);
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

  return (
    <div style={{ padding: '1rem' }}>
      <BackButton />
      <h2>Your Customers</h2>
      {customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        customers.map((customer) => (
          <SmallCustomerPreview key={customer._id} customer={customer} />
        ))
      )}
    </div>
  );
};

export default CustomersPage;
