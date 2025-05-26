import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import OrdersList from './components/OrdersListBySalesPersonID';
import OrderPreview from './components/OrderPreview';
import Menu from './components/Menu';

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <LoginForm onLogin={setUser} />;
  }

  return (
   <>
      <Menu />
      <Routes>
        <Route path="/" element={<OrdersList salespersonId={user.salesperson_id   } />} />
        <Route path="/orders" element={<OrdersList salespersonId={user.salesperson_id} />} />
        <Route path="/orders/:orderId" element={<OrderPreview />} />
      </Routes>
    </>
  );
}

export default App;
