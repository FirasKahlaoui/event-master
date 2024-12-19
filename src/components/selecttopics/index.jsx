import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../contexts/authContext";
import "./SelectTopics.css";

const SelectTopics = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [selectedTopics, setSelectedTopics] = useState([]);
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

  const handleTopicToggle = (topic) => {
    setSelectedTopics((prevSelectedTopics) =>
      prevSelectedTopics.includes(topic)
        ? prevSelectedTopics.filter((t) => t !== topic)
        : [...prevSelectedTopics, topic]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, { topics: selectedTopics });
      navigate("/home");
    }
  };

  return (
    <div className="select-topics-container">
      <h2>Select Your Topics</h2>
      <form onSubmit={handleSubmit} className="select-topics-form">
        <div className="topics-list">
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
        <button type="submit" className="submit-button">
          Save Topics
        </button>
      </form>
    </div>
  );
};

export default SelectTopics;