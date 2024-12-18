import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { doSignInWithEmailAndPassword } from "../../../firebase/auth";
import { useAuth } from "../../../contexts/authContext";
import { db } from "../../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./AdminLogin.css";

const AdminLogin = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (currentUser) {
        try {
          // Fetch admin document by UID
          const adminDoc = await getDoc(doc(db, "admin", currentUser.uid));
          if (adminDoc.exists() && adminDoc.data().role === "admin") {
            setIsAdmin(true);
          } else {
            console.error("User is not an admin or role is invalid.");
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
        }
      }
      setLoading(false);
    };
    checkAdminStatus();
  }, [currentUser]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        const userCredential = await doSignInWithEmailAndPassword(
          email,
          password
        );
        const user = userCredential.user;

        // Fetch admin document to verify role
        const adminDoc = await getDoc(doc(db, "admin", user.uid));
        if (adminDoc.exists() && adminDoc.data().role === "admin") {
          setCurrentUser(user);
          setIsAdmin(true);
          navigate("/admin-dashboard");
        } else {
          setErrorMessage(
            "You are not authorized to access the admin dashboard."
          );
        }
      } catch (error) {
        setErrorMessage("Error signing in: " + error.message);
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (currentUser && isAdmin) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return (
    <div>
      {currentUser && !isAdmin && <Navigate to="/home" replace />}
      <main className="admin-login-container">
        <div className="admin-login-box">
          <div className="admin-login-header">
            <h3>Admin Login</h3>
          </div>
          <form onSubmit={onSubmit} className="admin-login-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errorMessage && (
              <span className="error-message">{errorMessage}</span>
            )}
            <button
              type="submit"
              disabled={isSigningIn}
              className={`submit-button ${isSigningIn ? "disabled" : ""}`}
            >
              {isSigningIn ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
