import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";
import { db } from "../../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import "./AdminLogin.css";

const AdminLogin = () => {
  const { setCurrentAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      setLoading(true);
      try {
        const q = query(
          collection(db, "admin"),
          where("email", "==", email),
          where("password", "==", password)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const adminDoc = querySnapshot.docs[0];
          const adminData = adminDoc.data();

          setCurrentAdmin({
            uid: adminData.uid,
            email: adminData.email,
            role: adminData.role,
          });

          // Always set isAdmin to true
          setIsAdmin(true);
          navigate("/admin-dashboard");
        } else {
          setErrorMessage("Invalid email or password.");
          setIsSigningIn(false);
        }
      } catch (error) {
        console.error("Error during sign in:", error);
        setErrorMessage(error.message);
        setIsSigningIn(false);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAdmin) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return (
    <div>
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
      <footer className="admin-login-footer">
        Made with love by{" "}
        <a
          href="https://github.com/FirasKahlaoui"
          target="_blank"
          rel="noopener noreferrer"
        >
          Firas Kahlaoui
        </a>
      </footer>
    </div>
  );
};

export default AdminLogin;
