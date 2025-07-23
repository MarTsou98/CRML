const BASE_URL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5137';
import { useNavigate } from 'react-router-dom';

const NavbarRight = ({ user }) => {
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login'); // ✅ SPA-friendly redirect
  };

  return (
    <div className="navbar-right">
      <span>{user.username} ({user.role})</span>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};


export default NavbarRight;
