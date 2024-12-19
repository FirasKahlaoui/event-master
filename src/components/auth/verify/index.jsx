import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Verify.css";

const Verify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, verificationCode } = location.state;

  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code === verificationCode) {
      navigate("/home");
    } else {
      setErrorMessage("Invalid verification code.");
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-box">
        <h3>Verify Your Email</h3>
        <p>We have sent a verification code to {email}. Please enter it below.</p>
        <form onSubmit={handleSubmit} className="verify-form">
          <div className="form-group">
            <label>Verification Code</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          {errorMessage && (
            <span className="error-message">{errorMessage}</span>
          )}
          <button type="submit" className="submit-button">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verify;