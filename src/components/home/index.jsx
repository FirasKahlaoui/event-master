import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar";
import EventList from "../eventlist";
import { getEvents } from "../../firebase/events";
import { useAuth } from "../../contexts/authContext";
import { Link } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./HomePage.css";

const HomePage = () => {
  const { currentUser, userLoggedIn } = useAuth();
  const [events, setEvents] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchUserTopics = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userTopics = userDoc.data().topics || [];
          const recommended = events.filter((event) =>
            event.topics.some((topic) => userTopics.includes(topic))
          );
          setRecommendedEvents(recommended);
        }
      } catch (error) {
        console.error("Error fetching user topics:", error);
      }
    };

    if (currentUser) {
      fetchUserTopics();
    }
  }, [currentUser, events]);

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
      {recommendedEvents.length > 0 && (
        <div className="recommended-events">
          <h2>Recommended Events</h2>
          <div className="explore-event-list">
            {recommendedEvents.map((event) => (
              <div className="explore-event-item" key={event.id}>
                <img
                  src={event.image || "/assets/default-event.jpg"}
                  alt={event.title}
                  className="explore-event-thumbnail"
                />
                <div className="explore-event-details">
                  <h3>{event.title}</h3>
                  <p>{event.shortDescription}</p>
                  <p className="explore-event-date">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => navigate(`/event/${event.id}`)}
                    className="explore-event-link"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;