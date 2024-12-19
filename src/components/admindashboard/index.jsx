import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../../contexts/authContext";
import Navbar from "../navbar";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsCollection = collection(db, "events");
      const eventsSnapshot = await getDocs(eventsCollection);
      setEvents(eventsSnapshot.docs.map((doc) => doc.data()));
    };

    const fetchUsers = async () => {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      setUsers(usersSnapshot.docs.map((doc) => doc.data()));
    };

    fetchEvents();
    fetchUsers();
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Navbar />
      <div className="admin-dashboard-container">
        <h1>Admin Dashboard</h1>
        <div className="kpi-container">
          <div className="kpi">
            <h2>Total Events</h2>
            <p>{events.length}</p>
          </div>
          <div className="kpi">
            <h2>Total Users</h2>
            <p>{users.length}</p>
          </div>
          {/* Add more KPIs as needed */}
        </div>
        {/* Add more visualizations and data as needed */}
      </div>
    </div>
  );
};

export default AdminDashboard;
