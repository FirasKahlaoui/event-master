import React, { useState, useEffect } from "react";
import Navbar from "../navbar";
import EventList from "../eventlist";
import { getEvents } from "../../firebase/events";
import { useAuth } from "../../contexts/authContext";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const { userLoggedIn } = useAuth(); // Access the user login status
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

  const displayedEvents = userLoggedIn ? events : events.slice(0, 2); // Show 2 events if not logged in

  return (
    <div>
      <Navbar />
      <main className="home-main">
        <div className="left-section">
          <h1>Welcome to EventMaster</h1>
          <p>
            Discover upcoming events and activities.
            {userLoggedIn ? "" : " Log in to explore more!"}
          </p>
          {!userLoggedIn && (
            <Link to="/login" className="login-link">
              Log in to explore more
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
