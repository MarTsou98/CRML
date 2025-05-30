import React, { useState, useEffect, createContext,useContext } from 'react';

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
export function useUser() {
  return useContext(UserContext);
}
