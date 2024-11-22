import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "../navbar";
import "./Profile.css";

const Profile = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [currentUser.uid]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <h1>Profile</h1>
        <div className="profile-details">
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {currentUser.email}</p>
          <p><strong>Joined Events:</strong> {userData.joinedEvents.length}</p>
          {/* Add more user details as needed */}
        </div>
      </div>
    </div>
  );
};

export default Profile;