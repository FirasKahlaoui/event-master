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
  deleteDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { useAuth } from "../../contexts/authContext";
import Navbar from "../navbar";
import "./MyEvents.css";
import emailjs from "emailjs-com";

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

  const handleManageEvent = (eventId) => {
    navigate(`/manage-event/${eventId}`);
  };

  const handleCancelJoin = async (eventId) => {
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, { joinedEvents: arrayRemove(eventId) });
      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, { joinedUsers: arrayRemove(currentUser.uid) });
      setJoinedEvents(joinedEvents.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error("Error canceling join:", error);
    }
  };

  const handleDeleteEvent = async (eventId, joinedUsers) => {
    try {
      // Delete the event from Firestore
      await deleteDoc(doc(db, "events", eventId));
      setCreatedEvents(createdEvents.filter((event) => event.id !== eventId));

      // Send email notifications to joined users
      joinedUsers.forEach(async (userId) => {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const userEmail = userDoc.data().email;
          const templateParams = {
            to_name: userDoc.data().name,
            to_email: userEmail,
            message: "The event you joined has been removed.",
          };
          emailjs
            .send(
              "service_a2fgtpl",
              "template_54gkyuq",
              templateParams,
              "YLIxjdVVSO6A6_061"
            )
            .then(
              (response) => {
                console.log(
                  "Email sent successfully:",
                  response.status,
                  response.text
                );
              },
              (error) => {
                console.error("Error sending email:", error);
              }
            );
        }
      });
    } catch (error) {
      console.error("Error deleting event:", error);
    }
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
                  <img
                    src={event.image}
                    alt={event.title}
                    className="event-image"
                  />
                  <div className="event-details">
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                    <p>{new Date(event.date).toLocaleDateString()}</p>
                    <button
                      onClick={() => handleManageEvent(event.id)}
                      className="manage-button"
                    >
                      Manage
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteEvent(event.id, event.joinedUsers)
                      }
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
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
                  <img
                    src={event.image}
                    alt={event.title}
                    className="event-image"
                  />
                  <div className="event-details">
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                    <p>{new Date(event.date).toLocaleDateString()}</p>
                    <button
                      onClick={() => handleCancelJoin(event.id)}
                      className="cancel-button"
                    >
                      Cancel Join
                    </button>
                  </div>
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
