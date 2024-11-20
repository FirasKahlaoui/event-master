/* eslint-disable no-unused-vars */
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import "./EventList.css";

const EventList = ({ events }) => {
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleViewDetails = (eventId) => {
    if (userLoggedIn) {
      navigate(`/event/${eventId}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="event-list">
      <h2>Upcoming Events</h2>
      <div className="event-list-container">
        {events.length > 0 ? (
          events.map((event) => (
            <div className="event-item" key={event.id}>
              <img
                src={event.image || "/assets/default-event.jpg"}
                alt={event.title}
                className="event-thumbnail"
              />
              <div className="event-details">
                <h3>{event.title}</h3>
                <p>{event.shortDescription}</p>
                <p className="event-date">
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleViewDetails(event.id)}
                  className="event-link"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No upcoming events available.</p>
        )}
      </div>
    </section>
  );
};

export default EventList;
