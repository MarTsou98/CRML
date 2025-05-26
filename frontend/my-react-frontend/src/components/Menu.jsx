import React from 'react';
import { Link } from 'react-router-dom';

function Menu() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Orders</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        {/* other menu links */}
      </ul>
    </nav>
  );
}

export default Menu;
