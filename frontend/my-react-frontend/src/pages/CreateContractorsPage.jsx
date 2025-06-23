import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/NewContractor.css';

const NewContractor = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    Role: '',
    phone: '',
    email: '',
    ContractorNotes: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = `${key.replace(/([A-Z])/g, ' $1')} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please correct the highlighted fields');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    const salesperson_id = user?.salesperson_id;

    try {
      await axios.post('http://localhost:5000/api/createContractor', {
        ...formData,
        salesperson_id, // Fallback if no salesperson_id
      });
      toast.success('Contractor created successfully!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      console.error(err);
      toast.error('Failed to create contractor.');
    }
  };

  return (
  <div className="new-contractor-wrapper">
  <div className="new-contractor-content">
    <ToastContainer position="top-right" />
    <BackButton />
    <h2 className="new-contractor-heading">Δημιουργία νέου εργολάβου</h2>

    <form onSubmit={handleSubmit} className="new-contractor-form">
     {[
  { name: 'firstName', label: 'Όνομα' },
  { name: 'lastName', label: 'Επίθετο' },
  { name: 'Role', label: 'Ρόλος' },
  { name: 'phone', label: 'Τηλέφωνο' },
  { name: 'email', label: 'Email' },
].map(({ name, label }) => (
  <div className="new-contractor-form-group" key={name}>
    <label className="new-contractor-label">{label}:</label>
    <input
      type="text"
      value={formData[name]}
      onChange={(e) => handleChange(name, e.target.value)}
      className={`new-contractor-input ${errors[name] ? 'error' : ''}`}
    />
    {errors[name] && (
      <small className="new-contractor-error-message">
        {errors[name]}
      </small>
    )}
  </div>
))}

      <div className="new-contractor-form-group">
        <label className="new-contractor-label">Σημειώσεις:</label>
        <textarea
          value={formData.ContractorNotes}
          onChange={(e) => handleChange('ContractorNotes', e.target.value)}
          rows={4}
          placeholder="Enter any relevant notes about the contractor"
          className="new-contractor-input"
        />
        {errors.ContractorNotes && (
          <small className="new-contractor-error-message">
            {errors.ContractorNotes}
          </small>
        )}
      </div>

      <button type="submit" className="new-contractor-button">
       Δημιουργία εργολάβου
      </button>
    </form>
  </div>
</div>

  );
};

export default NewContractor;
