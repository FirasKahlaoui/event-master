import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import Navbar from "../navbar";
import { useAuth } from "../../contexts/authContext";
import "./Explore.css";

const Explore = () => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = () => {
      const eventsCollection = collection(db, "events");
      const unsubscribe = onSnapshot(eventsCollection, (snapshot) => {
        const eventsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventsList);
      });

      return unsubscribe;
    };

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

    const unsubscribeEvents = fetchEvents();
    if (currentUser) {
      fetchUserTopics();
    }

    // Cleanup the listener on unmount
    return () => {
      unsubscribeEvents();
    };
  }, [currentUser, events]);

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
                      onClick={() => handleViewDetails(event.id)}
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
    </div>
  );
};

export default Explore;
