import React, { useState } from "react";
import { auth } from "../../firebase/firebase";
import { PhoneAuthProvider, multiFactor, RecaptchaVerifier } from "firebase/auth";

const TwoFactorSetup = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [error, setError] = useState("");

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          onSignInSubmit();
        },
      },
      auth
    );
  };

  const onSignInSubmit = async (e) => {
    e.preventDefault();
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    const phoneProvider = new PhoneAuthProvider(auth);

    try {
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        appVerifier
      );
      setVerificationId(verificationId);
    } catch (error) {
      setError(error.message);
    }
  };

  const onVerifyCodeSubmit = async (e) => {
    e.preventDefault();
    const credential = PhoneAuthProvider.credential(
      verificationId,
      verificationCode
    );

    try {
      const user = auth.currentUser;
      await multiFactor(user).enroll(credential, "My Phone Number");
      alert("Two-factor authentication enabled successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Set up Two-Factor Authentication</h2>
      <form onSubmit={onSignInSubmit}>
        <div id="recaptcha-container"></div>
        <input
          type="tel"
          placeholder="Phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <button type="submit">Send Verification Code</button>
      </form>
      {verificationId && (
        <form onSubmit={onVerifyCodeSubmit}>
          <input
            type="text"
            placeholder="Verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <button type="submit">Verify Code</button>
        </form>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default TwoFactorSetup;