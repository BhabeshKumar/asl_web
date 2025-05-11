import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, provider } from "./firebase";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// 1️⃣ Create Context
const AuthContext = createContext();

// 2️⃣ Hook to use context
export const useAuth = () => useContext(AuthContext);

// 3️⃣ Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Monitor user login status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const loginWithGoogle = () => signInWithPopup(auth, provider);

  // ✅ Add logout function here
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
