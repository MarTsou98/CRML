import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SmallOrderPreview from '../components/SmallOrderPreview'; // adjust the path if needed
import BackButton from '../components/BackButton'; // adjust the path if needed
import './css/CustomerDetails.css'; // adjust the path if needed
import { useNavigate } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
// Inside your component

const CustomerDetails = () => {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/customers/${customerId}`);
        setCustomer(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch customer.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [customerId]);

  if (loading) return <p>Loading customer...</p>;
  if (error) return <p>{error}</p>;
  if (!customer) return <p>Customer not found.</p>;

  return (
    
  <div className="customer-details-wrapper">
    <div className="customer-details-content">
      <BackButton />
      <h2 className="customer-details-heading">Λεπτομέρειες Πελάτη</h2>

      <div className="customer-details-section">
        <p><strong>Όνομα:</strong> {customer.firstName} {customer.lastName}</p>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>Τηλέφωνο:</strong> {customer.phone}</p>
        <p><strong>Διεύθυνση:</strong> {customer.address}</p>
        <p><strong>Σημειώσεις:</strong> {customer.CustomerNotes}</p>
      </div>

<button
  className="add-order-button"
  onClick={() => navigate(`/orders/new/${customerId}`)}
>
  Προσθήκη Παραγγελίας
</button>
      <div className="customer-orders-section">
        <h3>Παραγγελίες</h3>
        {customer.orders.length === 0 ? (
          <p className="no-orders-message">Δεν υπάρχουν παραγγελίες.</p>
        ) : (
          customer.orders.map((order) => (
            <SmallOrderPreview key={order._id} order={order} />
          ))
        )}
      </div>
    </div>
  </div>
);
};

export default CustomerDetails;
