import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import Carousel from '../components/carousel'

function DashBoard() {
  const { user } = useContext(UserContext);

  if (!user) {
    return <p>Loading user data...</p>;  // Or redirect to login if not authenticated
  }

  return (
    <div>
     

      <h1>Welcome, {user.username}!</h1>



      <Carousel style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 10 }} />
    </div>
  );
}

export default DashBoard;
