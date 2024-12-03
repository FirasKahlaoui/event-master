import React, { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";
import {
  doCreateUserWithEmailAndPassword,
  doSignInWithGoogle,
  updateUserProfile,
} from "../../../firebase/auth";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);

  const validatePassword = (password) => {
    const minLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return minLength && hasUpperCase && hasSymbol;
  };

  const onPasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordValid(validatePassword(newPassword));
    setConfirmPasswordValid(newPassword === confirmPassword);
  };

  const onConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setConfirmPasswordValid(newConfirmPassword === password);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isRegistering && passwordValid && confirmPasswordValid) {
      setIsRegistering(true);
      try {
        const userCredential = await doCreateUserWithEmailAndPassword(
          email,
          password
        );
        await updateUserProfile(userCredential.user, { displayName: username });
        navigate("/select-topics");
      } catch (error) {
        setErrorMessage(error.message);
        setIsRegistering(false);
      }
    } else {
      setErrorMessage("Please fill in all required fields correctly.");
    }
  };

  const onGoogleSignUp = async (e) => {
    e.preventDefault();
    if (!isRegistering) {
      setIsRegistering(true);
      try {
        await doSignInWithGoogle();
        navigate("/select-topics");
      } catch (error) {
        setErrorMessage(error.message);
        setIsRegistering(false);
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      {userLoggedIn && <Navigate to="/home" replace />}

      <main className="signup-container">
        <div className="signup-box">
          <div className="signup-left">
            <div className="signup-header">
              <h3>Create a New Account</h3>
            </div>
            <form onSubmit={onSubmit} className="signup-form">
              <div className="signup-form-group">
                <label>Username</label>
                <input
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={!username && errorMessage ? "invalid" : ""}
                />
              </div>
              <div className="signup-form-group">
                <label>Email</label>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={!email && errorMessage ? "invalid" : ""}
                />
              </div>
              <div className="signup-form-group">
                <label>Password</label>
                <div className="signup-form-group signup-password-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={onPasswordChange}
                    disabled={isRegistering}
                    className={passwordValid ? "valid" : "invalid"}
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="signup-show-password-button"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="signup-password-requirements">
                  <p className={password.length >= 6 ? "valid" : "invalid"}>
                    Minimum 6 characters
                  </p>
                  <p className={/[A-Z]/.test(password) ? "valid" : "invalid"}>
                    At least one uppercase letter
                  </p>
                  <p
                    className={
                      /[!@#$%^&*(),.?":{}|<>]/.test(password)
                        ? "valid"
                        : "invalid"
                    }
                  >
                    At least one symbol
                  </p>
                </div>
              </div>
              <div className="signup-form-group">
                <label>Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="off"
                  required
                  value={confirmPassword}
                  onChange={onConfirmPasswordChange}
                  disabled={isRegistering}
                  className={confirmPasswordValid ? "valid" : "invalid"}
                />
              </div>
              {errorMessage && (
                <span className="signup-error-message">{errorMessage}</span>
              )}
              <button
                type="submit"
                disabled={isRegistering || !passwordValid || !confirmPasswordValid}
                className={`signup-submit-button ${isRegistering ? "disabled" : ""}`}
              >
                {isRegistering ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
          </div>
          <div className="signup-right">
            <div className="signup-divider">
              <div className="signup-line"></div>
              <div className="signup-or">OR</div>
              <div className="signup-line"></div>
            </div>
            <button
              disabled={isRegistering}
              onClick={onGoogleSignUp}
              className={`signup-google-button ${isRegistering ? "disabled" : ""}`}
            >
              <svg
                className="signup-google-icon"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z"
                  fill="#EA4335"
                />
                <path
                  d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z"
                  fill="#FBBC04"
                />
                <path
                  d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z"
                  fill="#34A853"
                />
                <path
                  d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z"
                  fill="#4285F4"
                />
              </svg>
              {isRegistering ? "Signing Up..." : "Continue with Google"}
            </button>
            <div className="signup-login-link">
              Already have an account? <Link to="/login">Continue</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Register;