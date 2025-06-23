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
   <div className="new-order-wrapper">
  <div className="new-order-content">
    <BackButton />
    <h2 className="new-order-heading">Add Payment to Order</h2>

    {error && <p className="new-order-message error">{error}</p>}

    <form onSubmit={handleSubmit} className="new-order-form">
      <div className="new-order-form-group">
        <label className="new-order-label">Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="new-order-input"
        />
      </div>

      <div className="new-order-form-group">
        <label className="new-order-label">Method:</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          required
          className="new-order-input"
        >
          <option value="">Select method</option>
          <option value="Cash">Cash</option>
          <option value="Bank">Bank</option>
        </select>
      </div>

      <div className="new-order-form-group">
        <span className="new-order-label">Payer:</span>
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
      </div>

      <div className="new-order-form-group">
        <label className="new-order-label">Notes:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="3"
          className="new-order-input"
        />
      </div>

      <button type="submit" className="new-order-button">
        Submit Payment
      </button>
    </form>
  </div>
</div>

  );
};

export default AddPayment;
