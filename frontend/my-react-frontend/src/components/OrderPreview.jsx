import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOrderById } from '../api'; // You need to implement this function
import Navbar from '../components/navBar/NavBar';
function OrderPreview() {
  const { orderId } = useParams(); // get the orderId from the URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderById(orderId)
      .then(data => {
        setOrder(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching order:', err);
        setError('Failed to load order');
        setLoading(false);
      });
  }, [orderId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!order) return <p>No order found</p>;

  const formattedDate = new Date(order.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

 return (

    <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
    
      <h2>Order Details</h2>

      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>Date:</strong> {formattedDate}</p>
      <p><strong>Invoice Type:</strong> {order.invoiceType}</p>

      <h3>Customer</h3>
      <p><strong>Name:</strong> {order.customer_id?.firstName} {order.customer_id?.lastName}</p>
      <p><strong>Email:</strong> {order.customer_id?.email}</p>
      <p><strong>Phone:</strong> {order.customer_id?.phone}</p>
      <p><strong>Address:</strong> {order.customer_id?.address}</p>

      <h3>Contractor</h3>
      <p><strong>Name:</strong> {order.contractor_id?.firstName} {order.contractor_id?.lastName}</p>
      <p><strong>Role:</strong> {order.contractor_id?.Role}</p>

      <h3>Financial Details</h3>
      <p><strong>Catalog Price (Τιμή Τιμοκαταλόγου):</strong> €{order.moneyDetails?.timi_Timokatalogou}</p>
      <p><strong>Sales Price (Τιμή Πώλησης):</strong> €{order.moneyDetails?.timi_Polisis}</p>
      <p><strong>Cash Paid:</strong> €{order.moneyDetails?.cash}</p>
      <p><strong>Bank Paid:</strong> €{order.moneyDetails?.bank}</p>
      <p><strong>Total Paid:</strong> €{order.moneyDetails?.totalpaid}</p>
      <p><strong>Total Damages:</strong> €{order.moneyDetails?.totaldamages}</p>
      <p><strong>Profit:</strong> €{order.moneyDetails?.profit}</p>
      <p><strong>FPA (VAT):</strong> €{order.moneyDetails?.FPA}</p>

      <h4>Damages</h4>
      {order.moneyDetails?.damages?.length ? (
        <ul>
          {order.moneyDetails.damages.map((dmg) => (
            <li key={dmg._id}>
              €{dmg.amount} - {dmg.notes} ({new Date(dmg.date).toLocaleDateString()})
            </li>
          ))}
        </ul>
      ) : (
        <p>No damages recorded</p>
      )}

      <h4>Discounts</h4>
      {order.moneyDetails?.discounts?.length ? (
        <ul>
          {order.moneyDetails.discounts.map((disc, index) => (
            <li key={index}>
              €{disc.amount} - {disc.notes} ({new Date(disc.date).toLocaleDateString()})
            </li>
          ))}
        </ul>
      ) : (
        <p>No discounts applied</p>
      )}

      <h4>Payments</h4>
      {order.moneyDetails?.payments?.length ? (
        <ul>
          {order.moneyDetails.payments.map((pmt) => (
            <li key={pmt._id}>
              €{pmt.amount} - {pmt.method} - {pmt.notes || 'No notes'} ({new Date(pmt.date).toLocaleDateString()})
            </li>
          ))}
        </ul>
      ) : (
        <p>No payments recorded</p>
      )}
    </div>
  );
}

export default OrderPreview;
