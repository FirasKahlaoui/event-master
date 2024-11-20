import React, { useState } from "react";
import { db } from "../../firebase/firebase";
import { addDoc, collection } from "firebase/firestore";
import { uploadImage } from "../utils/cloudinaryHelper";
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
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]);

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
      };
      await addDoc(collection(db, "events"), newEvent);

      alert("Event created successfully!");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event.");
    }
  };

  return (
    <form className="create-event-form" onSubmit={handleSubmit}>
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
      <div className="topics-container">
        {topicsList.map((topic) => (
          <div
            key={topic}
            className={`topic-item ${
              selectedTopics.includes(topic) ? "selected" : ""
            }`}
            onClick={() => handleTopicToggle(topic)}
          >
            {topic}
          </div>
        ))}
      </div>
      <button type="submit">Create Event</button>
    </form>
  );
};

export default CreateEvent;