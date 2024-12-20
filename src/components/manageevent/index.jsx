import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Navbar from "../navbar";
import "./ManageEvent.css";

const ManageEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [topics, setTopics] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventDoc = await getDoc(doc(db, "events", id));
        if (eventDoc.exists()) {
          const eventData = eventDoc.data();
          setEvent(eventData);
          setTitle(eventData.title);
          setDescription(eventData.description);
          setDate(eventData.date);
          setLocation(eventData.location);
          setImage(eventData.image);
          setTopics(eventData.topics.join(", "));
        } else {
          console.error("Event not found");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEvent();
  }, [id]);

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      const eventRef = doc(db, "events", id);
      await updateDoc(eventRef, {
        title,
        description,
        date,
        location,
        image,
        topics: topics.split(",").map((topic) => topic.trim()),
      });
      alert("Event updated successfully!");
      navigate("/my-events");
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleCancel = () => {
    navigate("/my-events");
  };

  if (!event) {
    return <p>Loading event details...</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="manage-event-container">
        <h1>Manage Event</h1>
        <form onSubmit={handleUpdateEvent}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              type="text"
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="topics">Topics (comma separated)</label>
            <input
              type="text"
              id="topics"
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              required
            />
          </div>
          <div className="form-buttons">
            <button type="submit" className="update-button">
              Update Event
            </button>
            <button type="button" className="cancel-button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageEvent;