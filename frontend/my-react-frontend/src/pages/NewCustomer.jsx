import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/NewCustomer.css';

const NewCustomer = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
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
    setErrors({ ...errors, [field]: '' }); // Clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please correct the highlighted fields');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    const id_of_salesperson = user?.salesperson_id;
    const id_of_contractor = user?.contractor_id;

    try {
      await axios.post('http://localhost:5000/api/customers/newCustomer', {
        ...formData,
        id_of_salesperson,
        id_of_contractor,
      });
      toast.success('Customer created successfully!');
      setTimeout(() => navigate('/customers/all'), 1000);
    } catch (err) {
      console.error(err);
      toast.error('Failed to create customer.');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <ToastContainer position="top-right" />
      <BackButton />
      <h2>Create New Customer</h2>
      <form onSubmit={handleSubmit}>
        {['firstName', 'lastName', 'email', 'phone', 'address'].map((field) => (
          <div className="nice-form-group" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
              value={formData[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              className={errors[field] ? 'error' : ''}
            />
            {errors[field] && <small className="error-text">{errors[field]}</small>}
          </div>
        ))}

        <div className="nice-form-group">
          <button type="submit" className="nice-button">Create Customer</button>
        </div>
      </form>
    </div>
  );
};

export default NewCustomer;
