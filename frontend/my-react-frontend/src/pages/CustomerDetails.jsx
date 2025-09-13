// src/pages/CustomerDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SmallOrderPreview from '../components/SmallOrderPreview';
import BackButton from '../components/BackButton';
import './css/CustomerDetails.css';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const CustomerDetails = () => {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [form, setForm] = useState({});
  const [salespeople, setSalespeople] = useState([]); // ✅ salespeople list
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  // Fetch customer + salespeople
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/customers/${customerId}`);
        setCustomer(res.data);
        setForm({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
          phone: res.data.phone,
          address: res.data.address,
          CustomerNotes: res.data.CustomerNotes || '',
          id_of_salesperson: res.data.id_of_salesperson?._id || '' // ✅ salesperson id
        });
      } catch (err) {
        console.error(err);
        setError('Failed to fetch customer.');
      } finally {
        setLoading(false);
      }
    };

    const fetchSalespeople = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/salespeople/all`);
        setSalespeople(res.data);
      } catch (err) {
        console.error('Error fetching salespeople:', err);
      }
    };

    fetchCustomer();
    fetchSalespeople();
  }, [customerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await axios.patch(`${BASE_URL}/api/customers/${customerId}`, form);
      setCustomer(res.data);
      setIsEditing(false);
      setMessage('✅ Customer updated successfully.');
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to update customer.');
    }
  };

  if (loading) return <p>Loading customer...</p>;
  if (error) return <p>{error}</p>;
  if (!customer) return <p>Customer not found.</p>;

  return (
    <div className="customer-details-wrapper">
      <div className="customer-details-content">
        <BackButton />
        <h2 className="customer-details-heading">Λεπτομέρειες Πελάτη</h2>

        <div className="customer-details-section">
          <p>
            <strong>Όνομα:</strong>{' '}
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName || ''}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName || ''}
                  onChange={handleChange}
                />
              </>
            ) : (
              `${customer.firstName} ${customer.lastName}`
            )}
          </p>

          <p>
            <strong>Email:</strong>{' '}
            {isEditing ? (
              <input type="email" name="email" value={form.email || ''} onChange={handleChange} />
            ) : (
              customer.email
            )}
          </p>

          <p>
            <strong>Τηλέφωνο:</strong>{' '}
            {isEditing ? (
              <input type="text" name="phone" value={form.phone || ''} onChange={handleChange} />
            ) : (
              customer.phone
            )}
          </p>

          <p>
            <strong>Διεύθυνση:</strong>{' '}
            {isEditing ? (
              <input type="text" name="address" value={form.address || ''} onChange={handleChange} />
            ) : (
              customer.address
            )}
          </p>

          <p>
            <strong>Όνομα Πωλητή:</strong>{' '}
            {isEditing ? (
              <select
                name="id_of_salesperson"
                value={form.id_of_salesperson || ''}
                onChange={handleChange}
              >
                <option value="">-- Επιλέξτε Πωλητή --</option>
                {salespeople.map((sp) => (
                  <option key={sp._id} value={sp._id}>
                    {sp.firstName} {sp.lastName}
                  </option>
                ))}
              </select>
            ) : customer.id_of_salesperson ? (
              `${customer.id_of_salesperson.firstName} ${customer.id_of_salesperson.lastName}`
            ) : (
              '—'
            )}
          </p>

          <p>
            <strong>Σημειώσεις:</strong>{' '}
            {isEditing ? (
              <textarea
                name="CustomerNotes"
                value={form.CustomerNotes || ''}
                onChange={handleChange}
              />
            ) : (
              customer.CustomerNotes
            )}
          </p>

          <div className="button-row" style={{ marginTop: '10px' }}>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)}>✏️ Επεξεργασία</button>
            ) : (
              <>
                <button onClick={handleSave}>💾 Αποθήκευση</button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setForm({
                      firstName: customer.firstName,
                      lastName: customer.lastName,
                      email: customer.email,
                      phone: customer.phone,
                      address: customer.address,
                      CustomerNotes: customer.CustomerNotes || '',
                      id_of_salesperson: customer.id_of_salesperson?._id || ''
                    });
                    setMessage(null);
                  }}
                >
                  Ακύρωση
                </button>
              </>
            )}
          </div>

          {message && (
            <p style={{ marginTop: '10px', color: message.startsWith('❌') ? 'red' : 'green' }}>
              {message}
            </p>
          )}
        </div>

        <button
          className="add-order-button"
          onClick={() => navigate(`/orders/new/${customerId}`)}
          disabled={isEditing} // ✅ disable while editing
          style={{
            cursor: isEditing ? 'not-allowed' : 'pointer',
            opacity: isEditing ? 0.5 : 1,
          }}
        >
          Προσθήκη Παραγγελίας
        </button>

        <div className="customer-orders-section">
          <h3>Παραγγελίες</h3>
          {customer.orders.length === 0 ? (
            <p className="no-orders-message">Δεν υπάρχουν παραγγελίες.</p>
          ) : (
            customer.orders.map((order) => <SmallOrderPreview key={order._id} order={order} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
