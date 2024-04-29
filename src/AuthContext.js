// src/contexts/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ref, get } from 'firebase/database';
import { auth, database } from './index';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      const adminRef = ref(database, `admins/${user.uid}`);
      get(adminRef)
        .then(snapshot => {
          setIsAdmin(snapshot.exists());
        })
        .catch(error => {
          console.error('Failed to check admin status:', error);
        });
    } else {
      setIsAdmin(false); // Ensure isAdmin is reset if user logs out
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
