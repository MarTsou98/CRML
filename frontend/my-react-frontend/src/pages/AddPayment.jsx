// pages/AddPayment.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../components/BackButton';

const AddPayment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [payer, setPayer] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/orders/${orderId}/addpayment`, {
        amount: Number(amount),
        payer,
        method,
        notes,
      });
      navigate(`/orders/${orderId}`);
    } catch (err) {
      console.error(err);
      setError('Failed to add payment.');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <BackButton />
      <h2>Add Payment to Order</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <label>
          Method:
          <select value={method} onChange={(e) => setMethod(e.target.value)} required>
            <option value="">Select method</option>
            <option value="Cash">Cash</option>
            <option value="Bank">Bank</option>
          </select>
        </label>
        Payer:
        <label>
          <input
            type="radio"
            value="Customer"
            checked={payer === 'Customer'}
            onChange={(e) => setPayer(e.target.value)}
          />
          Customer
        </label>
        <label>
          <input
            type="radio"
            value="Contractor"
            checked={payer === 'Contractor'}
            onChange={(e) => setPayer(e.target.value)}
          />
          Contractor
        </label>
        <label>
          Notes:
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
          />
        </label>
        <button type="submit">Submit Payment</button>
      </form>
    </div>
  );
};

export default AddPayment;
