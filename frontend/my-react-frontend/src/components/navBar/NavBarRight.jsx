const BASE_URL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5137';
const NavbarRight = ({ user }) => {
  if (!user) return null; // or a placeholder/loading



  
  return (
    <div className="navbar-right">
      <span>{user.username} ({user.role})</span>
      <button onClick={() => { window.location.href = `${BASE_URL}/login`;}}>Logout</button>
    </div>
  );
};

export default NavbarRight;
