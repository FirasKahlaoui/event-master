import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useAuth } from "../../contexts/authContext";
import "./EventDetails.css";

const EventDetails = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [event, setEvent] = useState(null);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      const eventDoc = await getDoc(doc(db, "events", id));
      if (eventDoc.exists()) {
        setEvent(eventDoc.data());
      }
    };
    fetchEvent();
  }, [id]);

  const handleJoinEvent = async () => {
    setIsJoining(true);
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, { joinedEvents: arrayUnion(id) }, { merge: true });
      alert("You have successfully joined the event!");
    } catch (error) {
      console.error("Error joining event:", error);
      alert("Failed to join the event.");
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
      <button onClick={handleJoinEvent} disabled={isJoining}>
        {isJoining ? "Joining..." : "Join Event"}
      </button>
    </div>
  );
};

export default EventDetails;
