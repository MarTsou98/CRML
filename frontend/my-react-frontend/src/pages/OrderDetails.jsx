import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

 const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch order.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <p>Loading order...</p>;
  if (error) return <p>{error}</p>;
  if (!order) return <p>Order not found.</p>;

  const { moneyDetails, invoiceType, Lock, createdAt, salesperson_id, contractor_id } = order;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Order Details</h2>

      <p><strong>Invoice Type:</strong> {invoiceType}</p>
      <p><strong>Locked:</strong> {Lock ? 'Yes' : 'No'}</p>
      <p><strong>Date:</strong> {new Date(createdAt).toLocaleDateString()}</p>

      <h3>Salesperson</h3>
      <p>{salesperson_id?.firstName} {salesperson_id?.lastName}</p>

      <h3>Contractor</h3>
      <p>{contractor_id?.firstName} {contractor_id?.lastName}</p>

      <h3>Money Details</h3>
      <p><strong>Τιμή Τιμοκαταλόγου:</strong> €{moneyDetails?.timi_Timokatalogou}</p>
      <p><strong>Τιμή Πώλησης:</strong> €{moneyDetails?.timi_Polisis}</p>
      <p><strong>Μετρητά:</strong> €{moneyDetails?.cash}</p>
      <p><strong>Τράπεζα:</strong> €{moneyDetails?.bank}</p>
      <p><strong>Κέρδος:</strong> €{moneyDetails?.profit}</p>
      <p><strong>ΦΠΑ:</strong> €{moneyDetails?.FPA}</p>

      <h4>Damages</h4>
      {moneyDetails?.damages?.length > 0 ? (
        <ul>
          {moneyDetails.damages.map((damage) => (
            <li key={damage._id}>Damage Date: {new Date(damage.date).toLocaleDateString()}</li>
          ))}
        </ul>
      ) : (
        <p>No damages recorded.</p>
      )}

      <h4>Payments</h4>
      {moneyDetails?.payments?.length > 0 ? (
        <ul>
          {moneyDetails.payments.map((p, index) => (
            <li key={index}>Payment of €{p.amount} on {new Date(p.date).toLocaleDateString()}</li>
          ))}
        </ul>
      ) : (
        <p>No payments yet.</p>
      )}
    </div>
  );
};

export default OrderDetails;
