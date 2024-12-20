import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
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
    const fetchCreatedEvents = () => {
      const createdEventsQuery = query(
        collection(db, "events"),
        where("creatorId", "==", currentUser.uid)
      );
      const unsubscribeCreatedEvents = onSnapshot(createdEventsQuery, (snapshot) => {
        setCreatedEvents(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      });

      return unsubscribeCreatedEvents;
    };

    const fetchJoinedEvents = () => {
      const userDocRef = doc(db, "users", currentUser.uid);
      const unsubscribeUserDoc = onSnapshot(userDocRef, (userDoc) => {
        if (userDoc.exists()) {
          const joinedEventIds = userDoc.data().joinedEvents || [];
          if (joinedEventIds.length > 0) {
            const joinedEventsQuery = query(
              collection(db, "events"),
              where("__name__", "in", joinedEventIds)
            );
            const unsubscribeJoinedEvents = onSnapshot(joinedEventsQuery, (snapshot) => {
              setJoinedEvents(
                snapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }))
              );
            });

            return unsubscribeJoinedEvents;
          }
        }
      });

      return unsubscribeUserDoc;
    };

    const unsubscribeCreatedEvents = fetchCreatedEvents();
    const unsubscribeJoinedEvents = fetchJoinedEvents();

    // Cleanup the listeners on unmount
    return () => {
      unsubscribeCreatedEvents();
      unsubscribeJoinedEvents();
    };
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

  const handleDeleteEvent = async (eventId, eventTitle) => {
    try {
      console.log("Event ID:", eventId);

      // Fetch the event document to get the joinedUsers array
      const eventDoc = await getDoc(doc(db, "events", eventId));
      if (!eventDoc.exists()) {
        console.error("Event document does not exist.");
        return;
      }

      const eventData = eventDoc.data();
      const joinedUsers = eventData.joinedUsers || [];
      console.log("Joined Users:", joinedUsers);

      // Delete the event from Firestore
      await deleteDoc(doc(db, "events", eventId));
      setCreatedEvents(createdEvents.filter((event) => event.id !== eventId));

      // Check if joinedUsers is defined and iterable
      if (Array.isArray(joinedUsers) && joinedUsers.length > 0) {
        // Send email notifications to joined users
        for (const userId of joinedUsers) {
          const userDoc = await getDoc(doc(db, "users", userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("User Data:", userData);

            const userEmail = userData.email;
            if (userEmail) {
              const templateParams = {
                to_email: userEmail,
                message: `The event: ${eventTitle} you joined has been canceled.`,
              };

              // Print all the variables
              console.log("Sending email with the following parameters:");
              console.log("Service ID: service_a2fgtpl");
              console.log("Template ID: template_54gkyuq");
              console.log("Public Key: YLIxjdVVSO6A6_061");
              console.log("Template Params:", templateParams);

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
                    console.error("Error details:", error.text);
                  }
                );
            } else {
              console.warn(
                `User with userId ${userId} does not have an email address.`
              );
            }
          } else {
            console.error(`User document for userId ${userId} does not exist.`);
          }
        }

        // Remove the event ID from each user's joinedEvents array
        for (const userId of joinedUsers) {
          const userRef = doc(db, "users", userId);
          await updateDoc(userRef, { joinedEvents: arrayRemove(eventId) });
        }
      } else {
        console.log(
          "No users joined the event or joinedUsers is not iterable."
        );
      }
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
                    <p>{event.shortDescription}</p>
                    <p>{new Date(event.date).toLocaleDateString()}</p>
                    <div className="button-group">
                      <button
                        onClick={() => handleManageEvent(event.id)}
                        className="manage-button"
                      >
                        Manage
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteEvent(event.id, event.title)
                        }
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </div>
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
                    <div className="button-group">
                      <button
                        onClick={() => handleCancelJoin(event.id)}
                        className="cancel-button"
                      >
                        Cancel Join
                      </button>
                    </div>
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