import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuth } from "../../contexts/authContext";
import AdminNavbar from "../adminnavbar";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { currentAdmin } = useAuth();
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const eventsCollection = collection(db, "events");
    const unsubscribeEvents = onSnapshot(eventsCollection, (snapshot) => {
      setEvents(snapshot.docs.map((doc) => doc.data()));
      setLoading(false);
    });

    const usersCollection = collection(db, "users");
    const unsubscribeUsers = onSnapshot(usersCollection, (snapshot) => {
      setUsers(snapshot.docs.map((doc) => doc.data()));
      setLoading(false);
    });

    // Cleanup the listeners on unmount
    return () => {
      unsubscribeEvents();
      unsubscribeUsers();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return (
    <div>
      <AdminNavbar />
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
