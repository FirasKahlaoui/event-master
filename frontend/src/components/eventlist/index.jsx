// EventList.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './EventList.css';

const EventList = ({ events }) => {
    return (
        <section className="event-list">
            <h2>Upcoming Events</h2>
            <div className="event-list-container">
                {events.length > 0 ? (
                    events.map((event) => (
                        <div className="event-item" key={event.id}>
                            <img src={event.thumbnail || '/assets/default-event.jpg'} alt={event.name} className="event-thumbnail" />
                            <div className="event-details">
                                <h3>{event.name}</h3>
                                <p>{event.description}</p>
                                <p className="event-date">{new Date(event.date).toLocaleDateString()}</p>
                                <Link to={`/event/${event.id}`} className="event-link">View Details</Link>
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
