import React, { useEffect, useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const ProtectedRoute = ({ children }) => {
  const { currentAdmin } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdminStatus = useCallback(async () => {
    try {
      if (currentAdmin) {
        const q = query(
          collection(db, "admin"),
          where("email", "==", currentAdmin.email)
        );
        const querySnapshot = await getDocs(q);
        console.log("Admin doc exists:", !querySnapshot.empty); // Debugging statement
        setIsAdmin(!querySnapshot.empty);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
    } finally {
      setLoading(false);
    }
  }, [currentAdmin]);

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log("Current admin:", currentAdmin); // Debugging statement
  console.log("Is admin:", isAdmin); // Debugging statement

  if (!currentAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
