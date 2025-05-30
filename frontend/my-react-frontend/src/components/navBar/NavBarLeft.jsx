import { Link } from 'react-router-dom';
import logo from '../../assets/Logo-lube.png'; 

const NavbarLeft = () => (
  <Link to="/dashboard" className="navbar-left" style={{ textDecoration: 'none', color: 'inherit' }}>
    <img src={logo} alt="LubeCRM Logo" className="logo" width={50} height={50} />
    <h2>LubeCRM</h2>
  </Link>
);

export default NavbarLeft;
