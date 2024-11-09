import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext"; // Import AuthProvider
import Register from "./components/auth/register";
import Login from "./components/auth/login";
import Home from "./components/home";

const App = () => {
  return (
    <AuthProvider>
      {" "}
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
