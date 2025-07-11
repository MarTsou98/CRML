import { NavLink } from 'react-router-dom';
import React from 'react';

const NavbarCenter = ({ user }) => (
  <div className="nav-links">
    <NavLink to="/orders" className={({ isActive }) => isActive ? "active" : ""}>Παραγγελίες</NavLink>
    <NavLink to="/orders/search" className={({ isActive }) => isActive ? "active" : ""}>Βρες Παραγγελία</NavLink>
    <NavLink to="/orders/new" className={({ isActive }) => isActive ? "active" : ""}>Νέα Παραγγελία</NavLink>
    <NavLink to="/customers/all" className={({ isActive }) => isActive ? "active" : ""}>Πελάτες</NavLink>
    <NavLink to="/customers/new" className={({ isActive }) => isActive ? "active" : ""}>Νέος Πελάτης</NavLink>
  
    <NavLink to="/customers/search" className={({ isActive }) => isActive ? "active" : ""}>Αναζήτηση Πελάτη</NavLink>

    {user.role === 'manager' && (
      <NavLink to="/AllContractorsPage" className={({ isActive }) => isActive ? "active" : ""}>Εργολάβοι</NavLink>
     
    )}
     {user.role === 'manager' && (
       <NavLink to="/newcontractors" className={({ isActive }) => isActive ? "active" : ""}> Δημιουργία Εργολάβου</NavLink>
     
    )}
    {user.role === 'manager' && user.username === "Tilemaxos" && (
       <NavLink to="stats" className={({ isActive }) => isActive ? "active" : ""}> Στατιστικά</NavLink>
     
    )}
  </div>
);

export default NavbarCenter;