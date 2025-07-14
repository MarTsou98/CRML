import React, { useEffect, useState } from 'react';
import SmallOrderPreview from '../components/SmallOrderPreview';
import axios from 'axios';
import BackButton from '../components/BackButton';
import Navbar from '../components/navBar/NavBar';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;
  const salespersonId = user?.salesperson_id;
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        let res;

        if (role === 'manager') {
          res = await axios.get(`${BASE_URL}/api/orders/`);
        } else if (role === 'salesperson' && salespersonId) {
          res = await axios.get(`${BASE_URL}/api/orders/salesperson/${salespersonId}`);
        } else {
          throw new Error('Unauthorized or missing user data.');
        }

        setOrders(res.data.reverse());    // Reverse to show latest orders first
      } catch (err) {
        setError('Failed to load orders.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [role, salespersonId]);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  // Pagination logic
  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  return (
    <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <BackButton />
        <h2>Orders {role === 'manager' ? 'for All Salespersons' : 'for You'}</h2>
        
        {currentOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          currentOrders.map((order) => (
            <SmallOrderPreview key={order._id} order={order} />
          ))
        )}

        {/* Pagination Controls */}
        {orders.length > ordersPerPage && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', gap: '1rem' }}>
            <button onClick={handlePrev} disabled={currentPage === 1}>
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={handleNext} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
