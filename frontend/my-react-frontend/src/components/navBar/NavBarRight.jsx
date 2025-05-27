const NavbarRight = ({ user }) => {
  if (!user) return null; // or a placeholder/loading

  return (
    <div className="navbar-right">
      <span>{user.username} ({user.role})</span>
      <button onClick={() => {/* logout logic */}}>Logout</button>
    </div>
  );
};

export default NavbarRight;
