import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/NewCustomer.css';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const NewCustomer = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    CustomerNotes: '',
  });

  const navigate = useNavigate();

  const fieldLabels = {
    firstName: 'Όνομα',
    lastName: 'Επώνυμο',
    email: 'Email',
    phone: 'Τηλέφωνο',
    address: 'Διεύθυνση',
    CustomerNotes: 'Σημειώσεις',
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user'));
    const id_of_salesperson = user?.salesperson_id;
    const id_of_contractor = user?.contractor_id;

    try {
      await axios.post(`${BASE_URL}/api/customers/newCustomer`, {
        ...formData,
        id_of_salesperson,
        id_of_contractor,
      });
      toast.success('Ο πελάτης δημιουργήθηκε με επιτυχία!');
      setTimeout(() => navigate('/customers/all'), 1000);
    } catch (err) {
      console.error(err);
      toast.error('Αποτυχία δημιουργίας πελάτη.');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <ToastContainer position="top-right" />
      <BackButton />
      <h2>Δημιουργία νέου Πελάτη</h2>
      <form onSubmit={handleSubmit}>
        {['firstName', 'lastName', 'email', 'phone', 'address'].map((field) => (
          <div className="nice-form-group" key={field}>
            <label>{fieldLabels[field]}:</label>
            <input
              type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
              value={formData[field]}
              onChange={(e) => handleChange(field, e.target.value)}
            />
          </div>
        ))}

        <div className="nice-form-group">
          <label>{fieldLabels.CustomerNotes}:</label>
          <textarea
            value={formData.CustomerNotes}
            onChange={(e) => handleChange('CustomerNotes', e.target.value)}
            rows={4}
            placeholder="Εισάγετε τυχόν σχετικές σημειώσεις σχετικά με τον πελάτη"
          />
        </div>

        <div className="nice-form-group">
          <button type="submit" className="nice-button">
            Δημιουργία Πελάτη
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewCustomer;
