import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../components/BackButton';
import './css/OrderDetails.css'; // Adjust the path if needed
import GeneralDetailsOfOrder from '../components/GeneralDetailsOfOrder';
import FinancialDetailsOfOrder from '../components/FinancialDetailsOfOrder';
import PaymentListOfOrder from '../components/PaymentListOfOrder';
import DamageListOfOrder from '../components/DamageListOfOrder';
import { NavLink } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';


const OrderDetails = () => {
  const user = JSON.parse(localStorage.getItem('user'));
const userRole = user?.role;
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/orders/${orderId}`);
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
  if (!order) return <p>Δεν βρέθηκε η παραγγελία.</p>;

  const { moneyDetails, invoiceType, Lock, createdAt, salesperson_id, contractor_id, customer_id , orderedFromCompany } = order;

  return (
  <div className="order-details-container">
  <BackButton />
  <h2>Στοιχεία Παραγγελίας</h2>

  {/* Wrap all three components in a flex container */}
  <div className="details-section">
    <div className="details-column">
      <GeneralDetailsOfOrder
  invoiceType={invoiceType}
  Lock={Lock}
  createdAt={createdAt}
  salesperson={salesperson_id}
  customer={customer_id}
  contractor={contractor_id}
  orderNotes={order.orderNotes}
  typeOfOrder={order.orderType}
  orderId={order._id}
  DateOfOrder={order.DateOfOrder}
  orderedFromCompany={orderedFromCompany}
/>

    </div>

    <div className="details-column">
      <FinancialDetailsOfOrder money={moneyDetails} orderId={order._id} />
    </div>

  <div className="details-column">
  <PaymentListOfOrder orderId={order._id} payments={moneyDetails?.payments} />

  {userRole === 'manager'  && (
    <DamageListOfOrder
      orderId={order._id}
      damages={moneyDetails?.damages}
     
    />
  )}

</div>

  </div>
</div>
);  
};

export default OrderDetails;
