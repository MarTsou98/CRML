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
import ContractorDetailsPage from './pages/ContractorDetailsPage';
import NotFound from './pages/NotFound';
import DashBoard from './pages/DashBoard';
import NewOrder from './pages/NewOrder'; // Adjust path if needed
import NewCustomer from './pages/NewCustomer'; 
import CustomerDetails from './pages/CustomerDetails';
import AllCustomersPage from './pages/AllCustomersPage'; // Adjust path if needed
import OrderDetails from './pages/OrderDetails'; // Adjust path if needed
import AddPayment from './pages/AddPayment'; // Adjust path if needed
import SearchCustomer from './pages/SearchCustomer'; // Adjust path if needed
import CreateContractorsPage from './pages/CreateContractorsPage'; // Adjust path if needed
import AllContractorsPage from './pages/AllContractorsPage';

function App() {
  const [user, setUser] = useState(null);

  return (
    
   <Routes>
  {/* This route is outside the Layout, so no Navbar shown */}
  <Route path="/login" element={<LoginPage onLogin={setUser} />} />

  {/* All other routes are wrapped with Layout, so Navbar shown */}
  <Route path="/" element={<Layout />}>
  
    <Route path="dashboard" element={<DashBoard />} />
    <Route path="orders" element={<OrdersPage />} />
    <Route path="new-order" element={<NewOrderPage />} />
    <Route path="new-order/:customerId" element={<NewOrderPage />} />
    <Route path="find-order" element={<FindOrderPage />} />
    <Route path="customers" element={<CustomersPage />} />
    <Route path="contractors" element={<ContractorsPage />} />
    <Route path="newcontractors" element={<CreateContractorsPage />} />
   <Route path="orders/new" element={<NewOrder />} />
<Route path="orders/new/:customerId" element={<NewOrder />} />
    <Route path="customers/search" element={<SearchCustomer />} />
    <Route path="customers/all" element={<AllCustomersPage />} />
    <Route path="customers/new" element={<NewCustomer />} />
    <Route path="customers/:customerId" element={<CustomerDetails />} />
    <Route path="orders/:orderId" element={<OrderDetails />} />
    <Route path="orders/:orderId/addpayment" element={<AddPayment />} />
    <Route path="/contractors/:id" element={<ContractorDetailsPage />} />
    <Route path="AllContractorsPage" element={<AllContractorsPage />} />
  </Route>

  <Route path="*" element={<NotFound />} />
</Routes>

   
  );
}

export default App;
