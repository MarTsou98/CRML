const NavbarRight = ({ user }) => {
  if (!user) return null; // or a placeholder/loading



  
  return (
    <div className="navbar-right">
      <span>{user.username} ({user.role})</span>
      <button onClick={() => { window.location.href = 'http://localhost:5173/login';}}>Logout</button>
    </div>
  );
};

export default NavbarRight;
