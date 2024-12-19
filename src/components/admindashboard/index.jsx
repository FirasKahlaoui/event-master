/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuth } from "../../contexts/authContext";
import AdminNavbar from "../adminnavbar";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import "./AdminDashboard.css";

const topicsList = [
  "Technology",
  "Music",
  "Sports",
  "Art",
  "Science",
  "Travel",
  "Health",
  "Education",
  "Business",
  "Finance",
  "Food",
  "Lifestyle",
  "Fashion",
  "Photography",
  "Gaming",
  "Movies",
  "Books",
  "Fitness",
  "Politics",
  "History",
  "Nature",
  "Environment",
  "DIY",
  "Crafts",
  "Parenting",
  "Relationships",
  "Spirituality",
  "Comedy",
  "Theater",
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4560",
  "#00E396",
  "#775DD0",
  "#FEB019",
  "#FF4560",
  "#775DD0",
  "#00E396",
  "#008FFB",
  "#FEB019",
  "#FF4560",
  "#775DD0",
  "#00E396",
  "#008FFB",
  "#FEB019",
  "#FF4560",
  "#775DD0",
  "#00E396",
  "#008FFB",
  "#FEB019",
  "#FF4560",
  "#775DD0",
  "#00E396",
  "#008FFB",
  "#FEB019",
  "#FF4560",
];

const AdminDashboard = () => {
  const { currentAdmin } = useAuth();
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topicData, setTopicData] = useState([]);
  const [mostJoinedEvents, setMostJoinedEvents] = useState([]);
  const [mostLikedEvents, setMostLikedEvents] = useState([]);

  useEffect(() => {
    const eventsCollection = collection(db, "events");
    const unsubscribeEvents = onSnapshot(eventsCollection, (snapshot) => {
      const eventsList = snapshot.docs.map((doc) => doc.data());
      setEvents(eventsList);
      setLoading(false);

      // Calculate topic data for the pie chart
      const topicCount = {};
      eventsList.forEach((event) => {
        event.topics.forEach((topic) => {
          if (topicCount[topic]) {
            topicCount[topic]++;
          } else {
            topicCount[topic] = 1;
          }
        });
      });

      const topicDataArray = Object.keys(topicCount).map((topic) => ({
        name: topic,
        value: topicCount[topic],
      }));

      setTopicData(topicDataArray);

      // Calculate most joined events
      const joinedEvents = [...eventsList]
        .filter((event) => event.joinedUsers && event.joinedUsers.length)
        .sort((a, b) => b.joinedUsers.length - a.joinedUsers.length)
        .slice(0, 5)
        .map((event) => ({
          name: event.title,
          value: event.joinedUsers.length,
        }));

      setMostJoinedEvents(joinedEvents);

      // Calculate most liked events
      const likedEvents = [...eventsList]
        .filter((event) => event.likes !== undefined)
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 5)
        .map((event) => ({
          name: event.title,
          value: event.likes,
        }));

      setMostLikedEvents(likedEvents);
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
        </div>
        <div className="chart-container">
          <h2>Event Topics Distribution</h2>
          <PieChart width={550} height={500}>
            <Pie
              data={topicData}
              cx={280}
              cy={280}
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {topicData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div className="charts-row">
          <div className="chart-container">
            <h2>Top 5 Most Joined Events</h2>
            <BarChart width={600} height={300} data={mostJoinedEvents}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </div>
          <div className="chart-container">
            <h2>Top 5 Most Liked Events</h2>
            <BarChart width={600} height={300} data={mostLikedEvents}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
