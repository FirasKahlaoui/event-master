import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAdminStatus = async () => {
      if (currentUser) {
        const adminDoc = await getDoc(doc(db, "admin", currentUser.uid));
        setIsAdmin(adminDoc.exists());
      }
      setLoading(false);
    };
    checkAdminStatus();
  }, [currentUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/admin-login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
