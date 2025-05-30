import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerSelect = ({ value, onChange }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const salespersonId = user?.salesperson_id;
      
      //if (!salespersonId) return;

      try {
        if(user.role === 'manager') {
        const res = await axios.get('http://localhost:5000/api/customers/all');
        setCustomers(res.data.reverse());
      } else {
        const res = await axios.get(`http://localhost:5000/api/customers/salesperson/${salespersonId}`);
        setCustomers(res.data.reverse());
      }
    } catch (err) {
      setError('Failed to load customers.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

    fetchCustomers();
  }, []);

  if (loading) return <p>Loading customers...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <label htmlFor="customer">Customer:</label>
      <select
        id="customer"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      >
        <option value="">-- Select customer --</option>
        {customers.map((customer) => (
          <option key={customer._id} value={customer._id}>
            {customer.firstName} {customer.lastName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomerSelect;
