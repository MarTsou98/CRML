// components/Layout/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../navBar/NavBar'; // Adjust the import path as necessary

const Layout = () => {
  return (
    <>
      <Navbar />
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
