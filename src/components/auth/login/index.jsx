import React, { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from "../../../firebase/auth";
import { useAuth } from "../../../contexts/authContext";
import { db } from "../../../firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import emailjs from "emailjs-com";
import "./Login.css";

const Login = () => {
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

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

        // Fetch user document from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (!userData.topics || userData.topics.length === 0) {
            navigate("/select-topics");
          } else {
            const verificationCode = generateVerificationCode();
            const templateParams = {
              to_email: email,
              message: `Your verification code is: ${verificationCode}`,
            };
            emailjs
              .send(
                "service_a2fgtpl",
                "template_54gkyuq",
                templateParams,
                "YLIxjdVVSO6A6_061"
              )
              .then(
                (response) => {
                  console.log(
                    "Email sent successfully:",
                    response.status,
                    response.text
                  );
                  navigate("/verify", { state: { email, verificationCode } });
                },
                (error) => {
                  console.error("Failed to send email:", error);
                  setErrorMessage("Failed to send verification email.");
                  setIsSigningIn(false);
                }
              );
          }
        } else {
          setErrorMessage("User document does not exist.");
          setIsSigningIn(false);
        }
      } catch (error) {
        setErrorMessage(error.message);
        setIsSigningIn(false);
      }
    }
  };

  const onGoogleSignIn = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        const userCredential = await doSignInWithGoogle();
        if (!userCredential) {
          throw new Error("No user credential returned from Google Sign-In");
        }
        const user = userCredential.user;

        // Print the user's email
        console.log("User email:", user.email);

        // Fetch user document from Firestore using email
        const usersCollection = collection(db, "users");
        const q = query(usersCollection, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        console.log("Query Snapshot:", querySnapshot);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          console.log("User Data:", userData);
          if (!userData.topics || userData.topics.length === 0) {
            navigate("/select-topics");
          } else {
            navigate("/home");
          }
        } else {
          setErrorMessage("User document does not exist.");
          setIsSigningIn(false);
        }
      } catch (error) {
        console.error("Error during Google Sign-In:", error);
        setErrorMessage(error.message);
        setIsSigningIn(false);
      }
    }
  };

  return (
    <div>
      {userLoggedIn && <Navigate to="/home" replace />}

      <main className="login-container">
        <div className="login-box">
          <div className="login-header">
            <h3>Welcome Back</h3>
          </div>
          <form onSubmit={onSubmit} className="login-form">
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
          <p className="signup-link">
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
          <div className="divider">
            <div className="line"></div>
            <div className="or">OR</div>
            <div className="line"></div>
          </div>
          <button
            disabled={isSigningIn}
            onClick={onGoogleSignIn}
            className={`google-button ${isSigningIn ? "disabled" : ""}`}
          >
            <svg
              className="google-icon"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z"
                fill="#4285F4"
              />
              <path
                d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z"
                fill="#34A853"
              />
              <path
                d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z"
                fill="#FBBC04"
              />
              <path
                d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z"
                fill="#EA4335"
              />
            </svg>
            {isSigningIn ? "Signing In..." : "Continue with Google"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;