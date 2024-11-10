import React, { useState, useEffect } from "react";
import Navbar from "../navbar";
import EventList from "../eventlist";
import { getEvents } from "../../firebase/events";
import { useAuth } from "../../contexts/authContext";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const { userLoggedIn } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventData = await getEvents();
        setEvents(eventData);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  // Always display only the first 2 events
  const displayedEvents = events.slice(0, 2);

  return (
    <div>
      <Navbar />
      <main className="home-main">
        <div className="left-section">
          <h1>Welcome to EventMaster</h1>
          <p>
            EventMaster brings all the best events directly to you. Discover
            upcoming gatherings, activities, and experiences tailored just for
            you! Dive in to explore detailed event information, personalized
            recommendations, and exciting possibilities.{" "}
            {userLoggedIn
              ? ""
              : "Please log in to access more events and features!"}
          </p>
          {!userLoggedIn && (
            <Link to="/login" className="login-link">
              Log in to explore more events
            </Link>
          )}
        </div>
        <div className="right-section">
          <EventList events={displayedEvents} />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
