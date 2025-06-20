import { NavLink } from 'react-router-dom';
import React from 'react';

const NavbarCenter = ({ user }) => (
  <div className="nav-links">
    <NavLink to="/orders" className={({ isActive }) => isActive ? "active" : ""}>Orders</NavLink>
    <NavLink to="/orders/find" className={({ isActive }) => isActive ? "active" : ""}>Find Order</NavLink>
    <NavLink to="/orders/new" className={({ isActive }) => isActive ? "active" : ""}>New Order</NavLink>
    <NavLink to="/customers/all" className={({ isActive }) => isActive ? "active" : ""}>Customers</NavLink>
    <NavLink to="/customers/new" className={({ isActive }) => isActive ? "active" : ""}>New Customer</NavLink>
  
    <NavLink to="/customers/search" className={({ isActive }) => isActive ? "active" : ""}>Search Customer</NavLink>

    {user.role === 'manager' && (
      <NavLink to="/contractors" className={({ isActive }) => isActive ? "active" : ""}>Contractors</NavLink>
    )}
  </div>
);

export default NavbarCenter;