import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../components/BackButton';
import './css/OrderDetails.css'; // Adjust the path if needed
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

  const { moneyDetails, invoiceType, Lock, createdAt, salesperson_id, contractor_id, customer_id } = order;

  return (
    <div style={{ padding: '1rem' }}>
      <BackButton />
      <h2>Order Details</h2>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Column 1: General Details */}
        <div style={{ flex: 1 }}>
          <h3>General Info</h3>
          <p><strong>Invoice Type:</strong> {invoiceType}</p>
          <p><strong>Locked:</strong> {Lock ? 'Yes' : 'No'}</p>
          <p><strong>Date:</strong> {new Date(createdAt).toLocaleDateString()}</p>

          <h4>Salesperson</h4>
          <p>{salesperson_id?.firstName} {salesperson_id?.lastName}</p>

          <h4>Customer</h4>
          <p>{customer_id?.firstName} {customer_id?.lastName}</p>

          <h4>Contractor</h4>
          <p>{contractor_id?.firstName} {contractor_id?.lastName}</p>
        </div>

        {/* Column 2: Financial Details */}
        <div style={{ flex: 1 }}>
          <h3>Financial Details</h3>
          <p><strong>Τιμή Τιμοκαταλόγου:</strong> €{moneyDetails?.timi_Timokatalogou}</p>
          <p><strong>Τιμή Πώλησης:</strong> €{moneyDetails?.timi_Polisis}</p>
          <p><strong>Μετρητά:</strong> €{moneyDetails?.cash}</p>
          <p><strong>Τράπεζα:</strong> €{moneyDetails?.bank}</p>
          <p><strong>Κέρδος:</strong> €{moneyDetails?.profit}</p>
          <p><strong>ΦΠΑ:</strong> €{moneyDetails?.FPA}</p>

          <h4>Remaining Shares</h4>
          <p><strong>Υπόλοιπο Μετρητών Πελάτη:</strong> €{moneyDetails?.customer_remainingShare_Cash}</p>
          <p><strong>Υπόλοιπο Τράπεζης Πελάτη:</strong> €{moneyDetails?.customer_remainingShare_Bank}</p>
          <p><strong>Υπόλοιπο Μετρητών Εργολάβου:</strong> €{moneyDetails?.contractor_remainingShare_Cash}</p>
          <p><strong>Υπόλοιπο Τράπεζης Εργολάβου:</strong> €{moneyDetails?.contractor_remainingShare_Bank}</p>
        </div>

        {/* Column 3: Payments */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Payments</h3>
            <Link to={`/orders/${order._id}/addpayment`}>
              <button>Add Payment</button>
            </Link>
          </div>

          {moneyDetails?.payments?.length > 0 ? (
            <ul>
              {moneyDetails.payments.map((p, index) => (
                <li key={index}>
                  Payment of €{p.amount} on {new Date(p.date).toLocaleDateString()} <br />
                  <em>Note:</em> {p.notes}
                </li>
              ))}
            </ul>
          ) : (
            <p>No payments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
