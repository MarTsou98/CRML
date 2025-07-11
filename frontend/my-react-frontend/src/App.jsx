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
import OrderByTypePage from './pages/OrderByTypePage'; // Adjust path if needed
import StatsDashboardPage from './pages/StatsDashboardPage';
import OrdersBySalespersonPage from './pages/OrdersBySalespersonPage'; // Adjust path if needed
import OrdersByContractorPage from './pages/OrdersByContractorPage';
import SummaryStatsPage from './pages/SummaryStatsPage';
import SalespersonStatsPage from './pages/SalespersonStatsPage';
import ContractorStatsPage from './pages/ContractorStatsPage';
import ProfitBySalespersonPage from './pages/ProfitBySalespersonPage';
import ProfitByContractorPage from './pages/ProfitByContractorPage';
import OrderSearchPage from './pages/OrdersSearchPage'; // Adjust path if needed
import AddDamage from './pages/AddDamage';



function App() {
  const [user, setUser] = useState(null);

  return (
    
   <Routes>
  {/* This route is outside the Layout, so no Navbar shown */}
  <Route path="/login" element={<LoginPage onLogin={setUser} />} />

  {/* All other routes are wrapped with Layout, so Navbar shown */}
  <Route path="/" element={<Layout />}>
  <Route path="/orders/:orderId/adddamage" element={<AddDamage />} />
    <Route path="dashboard" element={<DashBoard />} />
    <Route path="stats/by-company-type" element={<OrderByTypePage />} />
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
    <Route path="orders/search" element={<OrderSearchPage />} />
    <Route path="orders/:orderId" element={<OrderDetails />} />
    <Route path="orders/:orderId/addpayment" element={<AddPayment />} />
    <Route path="/contractors/:id" element={<ContractorDetailsPage />} />
    <Route path="stats" element={<StatsDashboardPage />} />
    <Route path="AllContractorsPage" element={<AllContractorsPage />} />
    <Route path="stats/by-salesperson" element={<OrdersBySalespersonPage />} />
    <Route path="stats/by-contractor" element={<OrdersByContractorPage />} />
    <Route path="stats/summary" element={<SummaryStatsPage />} />
    <Route path="stats/salesperson/:id" element={<SalespersonStatsPage />} />
    <Route path="stats/contractor/:id" element={<ContractorStatsPage />} />
    <Route path="stats/profit-by-salesperson" element={<ProfitBySalespersonPage />} />
    <Route path="stats/profit-by-contractor" element={<ProfitByContractorPage />} />
    <Route path="orders/search" element={<OrderSearchPage />} />
  </Route>

  <Route path="*" element={<NotFound />} />
</Routes>

   
  );
}

export default App;
