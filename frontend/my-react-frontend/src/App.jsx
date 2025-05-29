// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import OrdersPage from './pages/OrdersPage';
import NewOrderPage from './pages/NewOrderPage';
import FindOrderPage from './pages/FindOrderPage';
import CustomersPage from './pages/CustomerDetails';
import ContractorsPage from './pages/ContractorPage';
import NotFound from './pages/NotFound';
import DashBoard from './pages/DashBoard';
import NewOrder from './pages/NewOrder'; // Adjust path if needed
import NewCustomer from './pages/NewCustomer'; 
import CustomerDetails from './pages/CustomerDetails';
import AllCustomersPage from './pages/AllCustomersPage'; // Adjust path if needed
import OrderDetails from './pages/OrderDetails'; // Adjust path if needed
import AddPayment from './pages/AddPayment'; // Adjust path if needed
function App() {
  const [user, setUser] = useState(null);

  return (
    
     <Routes>
  <Route path="/login" element={<LoginPage onLogin={setUser} />} />

  <Route path="/" element={<Layout />}>
    <Route path="dashboard" element={<DashBoard />} />
    <Route path="orders" element={<OrdersPage />} />
    <Route path="new-order" element={<NewOrderPage />} />
    <Route path="find-order" element={<FindOrderPage />} />
    <Route path="customers" element={<CustomersPage />} />
    <Route path="contractors" element={<ContractorsPage />} />
    <Route path="/orders/new" element={<NewOrder />} />
    <Route path="/customers" element={<CustomersPage />} />
    <Route path="/customers/all" element={<AllCustomersPage />} />
    <Route path="/customers/new" element={<NewCustomer />} />
    <Route path="/customers/:customerId" element={<CustomerDetails />} />
    <Route path="/orders/:orderId" element={<OrderDetails />} />
    <Route path="/orders/:orderId/addpayment" element={<AddPayment />} />
  </Route>

  <Route path="*" element={<NotFound />} />
</Routes>

   
  );
}

export default App;
