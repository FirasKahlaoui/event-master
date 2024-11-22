import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import Navbar from "../navbar";
import "./Explore.css";

const Explore = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCollection = collection(db, "events");
        const eventsSnapshot = await getDocs(eventsCollection);
        const eventsList = eventsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventsList);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleViewDetails = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div className="explore-container">
        <h1>Explore Events</h1>
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-bar"
        />
        <div className="explore-event-list">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
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
                    onClick={() => handleViewDetails(event.id)}
                    className="explore-event-link"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No events available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;