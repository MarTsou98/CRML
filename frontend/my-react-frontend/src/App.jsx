// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import OrdersPage from './pages/OrdersPage';
import NewOrderPage from './pages/NewOrderPage';
import FindOrderPage from './pages/FindOrderPage';
import CustomersPage from './pages/CustomerPage';
import ContractorsPage from './pages/ContractorPage';
import NotFound from './pages/NotFound';
import DashBoard from './pages/DashBoard';
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
  </Route>

  <Route path="*" element={<NotFound />} />
</Routes>

   
  );
}

export default App;
