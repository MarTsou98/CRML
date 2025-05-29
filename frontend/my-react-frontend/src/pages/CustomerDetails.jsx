import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SmallOrderPreview from '../components/SmallOrderPreview'; // adjust the path if needed
import BackButton from '../components/BackButton'; // adjust the path if needed
const CustomerDetails = () => {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/customers/${customerId}`);
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
    <div style={{ padding: '1rem' }}>
      <BackButton />
      <h2>Customer Details</h2>
      <p><strong>Name:</strong> {customer.firstName} {customer.lastName}</p>
      <p><strong>Email:</strong> {customer.email}</p>
      <p><strong>Phone:</strong> {customer.phone}</p>
      <p><strong>Address:</strong> {customer.address}</p>
      <p><strong>Salesperson:</strong> {customer.id_of_salesperson?.firstName} {customer.id_of_salesperson?.lastName}</p>

      <div>
  <h3>Orders</h3>
  {customer.orders.length === 0 ? (
    <p>No orders available.</p>
  ) : (
    customer.orders.map((order) => (
      <SmallOrderPreview key={order._id} order={order} />
    ))
  )}
</div>
    </div>
  );
};

export default CustomerDetails;
