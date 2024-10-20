import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/auth/register";
import Login from "./components/auth/login";
import Home from "./components/home";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} /> {/* Default route */}
      </Routes>
    </Router>
  );
};

export default App;
