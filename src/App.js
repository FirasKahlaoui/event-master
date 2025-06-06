import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";
import Register from "./components/auth/register";
import Login from "./components/auth/login";
import AdminLogin from "./components/auth/adminlogin";
import Verify from "./components/auth/verify";
import Home from "./components/home";
import EventsDetails from "./components/eventsdetails";
import SelectTopics from "./components/selecttopics";
import MyEvents from "./components/myevents";
import CreateEvent from "./components/createevent";
import ManageEvent from "./components/manageevent";
import Explore from "./components/explore";
import Profile from "./components/profile";
import AdminDashboard from "./components/admindashboard";
import TwoFactorSetup from "./components/auth/TwoFactorSetup";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminEvents from "./components/adminevents";
import AdminUsers from "./components/adminusers";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/home" element={<Home />} />
          <Route path="/event/:id" element={<EventsDetails />} />
          <Route path="/select-topics" element={<SelectTopics />} />
          <Route path="/my-events" element={<MyEvents />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/manage-event/:id" element={<ManageEvent />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-events"
            element={
              <ProtectedRoute>
                <AdminEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-users"
            element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route path="/two-factor-setup" element={<TwoFactorSetup />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
