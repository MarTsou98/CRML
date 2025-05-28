import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewCustomer = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [email, setEmail]         = useState('');
  const [phone, setPhone]         = useState('');
  const [address, setAddress]     = useState('');
  const [error, setError]         = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    const id_of_salesperson = user?.salesperson_id;
    const id_of_contractor = user?.contractor_id; // adjust this if it comes from elsewhere

    //if (!id_of_salesperson || !id_of_contractor) {
     // setError('Salesperson or Contractor ID missing.');
     // return;
   // }

    try {
      await axios.post('http://localhost:5000/api/customers/newCustomer', {
        firstName,
        lastName,
        email,
        phone,
        address,
        id_of_salesperson,
        id_of_contractor,
      });

      navigate('/customers/all');
    } catch (err) {
      console.error(err);
      setError('Failed to create customer.');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Create New Customer</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Phone:</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label>Address:</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Create Customer</button>
      </form>
    </div>
  );
};

export default NewCustomer;
