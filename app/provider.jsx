"use client";
import React, { useEffect, useState, useContext } from 'react';
import { UserDetailContext } from '@/context/UserDetailContext';

function Provider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // If needed, you can fetch default user data here from a local source or hardcoded config
    // For now, we'll leave user as null or empty object
    setUser(null);
  }, []);

  return (
    <UserDetailContext.Provider value={{ user, setUser }}>
      <div>{children}</div>
    </UserDetailContext.Provider>
  );
}

export default Provider;

export const useUser = () => {
  const context = useContext(UserDetailContext);
  return context;
};
