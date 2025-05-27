import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import Navbar from '../components/navBar/NavBar';
function DashBoard() {
  const { user } = useContext(UserContext);

  if (!user) {
    return <p>Loading user data...</p>;  // Or redirect to login if not authenticated
  }

  return (
    <div>
<Navbar user={user} />
      <h1>Welcome, {user.username}!</h1>
      {/* rest of dashboard */}
    </div>
  );
}

export default DashBoard;
