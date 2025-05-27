import { Link } from 'react-router-dom';

const NavbarCenter = ({ role }) => (
  <div className="navbar-center">
    <Link to="/orders">Orders</Link>
    <Link to="/orders/find">Find Order</Link>
    <Link to="/orders/new">New Order</Link>
    <Link to="/customers">Customers</Link>
    {role === 'manager' && <Link to="/contractors">Contractors</Link>}
  </div>
);
export default NavbarCenter;