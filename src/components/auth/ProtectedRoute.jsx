import React, { useEffect, useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdminStatus = useCallback(async () => {
    try {
      if (currentUser) {
        const q = query(
          collection(db, "admin"),
          where("email", "==", currentUser.email)
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
  }, [currentUser]);

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log("Current user:", currentUser); // Debugging statement
  console.log("Is admin:", isAdmin); // Debugging statement

  if (!currentUser) {
    return <Navigate to="/admin-login" replace />;
  }
  if (currentUser && isAdmin) {
    return <Navigate to="/admin-dashboard" replace />;
  }
  if (currentUser && !isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
