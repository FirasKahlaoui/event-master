import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { addDoc, collection } from "firebase/firestore";
import { uploadImage } from "../utils/cloudinaryHelper";
import Navbar from "../navbar";
import { useAuth } from "../../contexts/authContext";
import "./CreateEvent.css";

const topicsList = [
  "Technology",
  "Music",
  "Sports",
  "Art",
  "Science",
  "Travel",
  "Health",
  "Education",
  "Business",
  "Finance",
  "Food",
  "Lifestyle",
  "Fashion",
  "Photography",
  "Gaming",
  "Movies",
  "Books",
  "Fitness",
  "Politics",
  "History",
  "Nature",
  "Environment",
  "DIY",
  "Crafts",
  "Parenting",
  "Relationships",
  "Spirituality",
  "Comedy",
  "Theater",
];

const CreateEvent = () => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleTopicToggle = (topic) => {
    setSelectedTopics((prevTopics) =>
      prevTopics.includes(topic)
        ? prevTopics.filter((t) => t !== topic)
        : [...prevTopics, topic]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !title ||
      !shortDescription ||
      !description ||
      !date ||
      !location ||
      !imageFile ||
      selectedTopics.length === 0
    ) {
      alert(
        "Please fill in all fields, select an image, and choose at least one topic."
      );
      return;
    }

    try {
      // Upload image to Cloudinary
      const uploadedImage = await uploadImage(imageFile); // This returns the image URL from Cloudinary

      // Save event details to Firestore with the image URL from Cloudinary
      const newEvent = {
        title,
        shortDescription,
        description,
        date,
        location,
        image: uploadedImage, // The Cloudinary URL of the image
        topics: selectedTopics,
        creatorId: currentUser.uid, // Add the creator's user ID
      };
      await addDoc(collection(db, "events"), newEvent);

      alert("Event created successfully!");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event.");
    }
  };

  const handleCancel = () => {
    navigate("/my-events");
  };

  return (
    <div>
      <Navbar />
      <form className="createEvent-form" onSubmit={handleSubmit}>
        <div className="createEvent-form-left">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Short Description"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input type="file" onChange={handleFileChange} />
        </div>
        <div className="createEvent-form-right">
          <div className="createEvent-topics-container">
            {topicsList.map((topic) => (
              <div
                key={topic}
                className={`createEvent-topic-item ${
                  selectedTopics.includes(topic) ? "createEvent-selected" : ""
                }`}
                onClick={() => handleTopicToggle(topic)}
              >
                {topic}
              </div>
            ))}
          </div>
          <div className="createEvent-buttons">
            <button type="submit">Create Event</button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
