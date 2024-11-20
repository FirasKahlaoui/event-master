/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, getDoc, setDoc, arrayUnion } from "firebase/firestore";
import { useAuth } from "../../contexts/authContext";
import "./EventDetails.css";

const EventDetails = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [event, setEvent] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      const eventDoc = await getDoc(doc(db, "events", id));
      if (eventDoc.exists()) {
        setEvent(eventDoc.data());
      }
    };

    const checkIfJoined = async () => {
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        const joinedEvents = userDoc.data().joinedEvents || [];
        setIsJoined(joinedEvents.includes(id));
      }
    };

    fetchEvent();
    checkIfJoined();
  }, [id, currentUser.uid]);

  const handleJoinEvent = async () => {
    setIsJoining(true);
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, { joinedEvents: arrayUnion(id) }, { merge: true });
      setIsJoined(true);
    } catch (error) {
      console.error("Error joining event:", error);
    } finally {
      setIsJoining(false);
    }
  };

  if (!event) {
    return <p>Loading event details...</p>;
  }

  return (
    <div className="event-details-page">
      <h2>{event.name}</h2>
      <p>{event.description}</p>
      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
      <button onClick={handleJoinEvent} disabled={isJoining || isJoined}>
        {isJoining ? "Joining..." : isJoined ? "Joined" : "Join Event"}
      </button>
      {isJoined && (
        <button onClick={() => navigate("/my-events")}>View My Events</button>
      )}
    </div>
  );
};

export default EventDetails;
