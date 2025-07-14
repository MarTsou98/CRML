// pages/AddPayment.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../components/BackButton';
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
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
      await axios.post(`${BASE_URL}/api/orders/${orderId}/addpayment`, {
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
    <h2 className="new-order-heading">Προσθήκη Πληρωμής στην Παραγγελία</h2>

    {error && <p className="new-order-message error">{error}</p>}

    <form onSubmit={handleSubmit} className="new-order-form">
      <div className="new-order-form-group">
        <label className="new-order-label">Ποσό:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="new-order-input"
        />
      </div>

      <div className="new-order-form-group">
        <label className="new-order-label">Μέθοδος:</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          required
          className="new-order-input"
        >
          <option value="">Επιλέξτε μέθοδο</option>
          <option value="Cash">Μετρητά</option>
          <option value="Bank">Τράπεζα</option>
        </select>
      </div>

      <div className="new-order-form-group">
        <span className="new-order-label">Πληρωτής:</span>
        <label>
          <input
            type="radio"
            value="Customer"
            checked={payer === 'Customer'}
            onChange={(e) => setPayer(e.target.value)}
          />
          Πελάτης
        </label>
        <label>
          <input
            type="radio"
            value="Contractor"
            checked={payer === 'Contractor'}
            onChange={(e) => setPayer(e.target.value)}
          />
          Εργολάβος
        </label>
      </div>

      <div className="new-order-form-group">
        <label className="new-order-label">Σημειώσεις:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="3"
          className="new-order-input"
        />
      </div>

      <button type="submit" className="new-order-button">
        Προσθήκη Πληρωμής
      </button>
    </form>
  </div>
</div>

  );
};

export default AddPayment;
