import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../../contexts/authContext";
import "./SelectTopics.css";

const topics = [
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
  "Dance",
  "Automotive",
  "Pets",
  "Gardening",
  "Real Estate",
  "Marketing",
  "Social Media",
  "Startups",
  "Investing",
  "Programming",
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "Blockchain",
  "Cryptocurrency",
  "Virtual Reality",
  "Augmented Reality",
  "Cybersecurity",
];

const SelectTopics = () => {
  const { currentUser } = useAuth();
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [visibleTopics, setVisibleTopics] = useState(25);
  const navigate = useNavigate();

  const handleTopicToggle = (topic) => {
    setSelectedTopics((prevTopics) =>
      prevTopics.includes(topic)
        ? prevTopics.filter((t) => t !== topic)
        : [...prevTopics, topic]
    );
  };

  const handleShowMore = () => {
    setVisibleTopics((prevVisibleTopics) => prevVisibleTopics + 10);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, { topics: selectedTopics }, { merge: true });
      navigate("/home");
    } catch (error) {
      console.error("Error saving topics:", error);
      alert("Failed to save topics.");
    }
  };

  return (
    <div className="select-topics-page">
      <h2>Select Your Topics of Interest</h2>
      <form onSubmit={handleSubmit}>
        <div className="topics-container">
          {topics.slice(0, visibleTopics).map((topic) => (
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
        {visibleTopics < topics.length && (
          <button
            type="button"
            onClick={handleShowMore}
            className="show-more-button"
          >
            Show More
          </button>
        )}
        <button type="submit" className="submit-button">
          Save and Continue
        </button>
      </form>
    </div>
  );
};

export default SelectTopics;
