import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "../../contexts/authContext";
import Navbar from "../navbar";
import "./MyEvents.css";

const MyEvents = () => {
  const { currentUser } = useAuth();
  const [createdEvents, setCreatedEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch events created by the user
        const createdEventsQuery = query(
          collection(db, "events"),
          where("creatorId", "==", currentUser.uid)
        );
        const createdEventsSnapshot = await getDocs(createdEventsQuery);
        setCreatedEvents(
          createdEventsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
  
        // Fetch events joined by the user
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const joinedEventIds = userDoc.data().joinedEvents || [];
          if (joinedEventIds.length > 0) {
            const joinedEventsQuery = query(
              collection(db, "events"),
              where("__name__", "in", joinedEventIds)
            );
            const joinedEventsSnapshot = await getDocs(joinedEventsQuery);
            setJoinedEvents(
              joinedEventsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
            );
          }
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
  
    fetchEvents();
  }, [currentUser.uid]);

  const handleCreateEvent = () => {
    navigate("/create-event");
  };

  return (
    <div>
      <Navbar />
      <div className="myevents-container">
        <div className="myevents-header">
          <h1>My Events</h1>
          <button onClick={handleCreateEvent} className="create-event-button">
            Create Event
          </button>
        </div>
        <div className="myevents-content">
          <div className="created-events">
            <h2>Events I Created</h2>
            {createdEvents.length > 0 ? (
              createdEvents.map((event) => (
                <div key={event.id} className="event-item">
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <p>{new Date(event.date).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p>No events created yet.</p>
            )}
          </div>
          <div className="joined-events">
            <h2>Events I Joined</h2>
            {joinedEvents.length > 0 ? (
              joinedEvents.map((event) => (
                <div key={event.id} className="event-item">
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <p>{new Date(event.date).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p>No events joined yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyEvents;