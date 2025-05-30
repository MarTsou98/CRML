import React from 'react';
import NavbarLeft from './NavbarLeft';
import NavbarCenter from './NavbarCenter';
import NavbarRight from './NavbarRight';
import './Navbar.css'; // make sure path is correct relative to Navbar.jsx
import { useUser } from '../../context/UserContext'; // Adjust path if needed

const Navbar = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <nav className="navbar">
       <div className="navbar-left">
        <NavbarLeft />
      </div>

      <div className="navbar-center">
        <NavbarCenter user={user}/>
      </div>

      <div className="navbar-right">
        <NavbarRight user={user} />
      </div>
    </nav>
  );
};

export default Navbar;
