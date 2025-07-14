import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const AddDamage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [typeOfDamage, setTypeOfDamage] = useState('');
  const [error, setError] = useState(null);

  const handleAddDamage = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/api/orders/${orderId}/adddamage`, {
        amount: parseFloat(amount),
        notes,
        typeOfDamage
      });
      navigate(`/orders/${orderId}`);
    } catch (err) {
      setError('Αποτυχία προσθήκης εξόδου.');
    }
  };

  return (
    <div>
      <h2>Προσθήκη Εξόδου</h2>
      <form onSubmit={handleAddDamage}>
        <div>
          <label>Ποσό:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Τύπος Εξόδου:</label>
          <select
            value={typeOfDamage}
            onChange={(e) => setTypeOfDamage(e.target.value)}
            required
          >
           <option value="">-- Επιλέξτε Τύπο --</option>
<option value="Μεταφορά εξωτερικού">Μεταφορά εξωτερικού</option>
<option value="Μεταφορά εσωτερικού">Μεταφορά εσωτερικού</option>
<option value="Τοποθέτηση">Τοποθέτηση</option>
<option value="Διάφορα">Διάφορα</option>

          </select>
        </div>
        <div>
          <label>Σημειώσεις:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <button type="submit">Καταχώρηση Εξόδου</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default AddDamage;

