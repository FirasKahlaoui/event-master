import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { db } from "../../firebase/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import Navbar from "../navbar";
import "./Profile.css";

const Profile = () => {
  const { currentUser, updatePassword, deleteUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleUpdateName = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        name: newName,
      });
      setUserData((prevData) => ({ ...prevData, name: newName }));
      setNewName("");
    } catch (error) {
      console.error("Error updating name:", error);
    }
    setLoading(false);
  };

  const handleUpdatePhone = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        phone: newPhone,
      });
      setUserData((prevData) => ({ ...prevData, phone: newPhone }));
      setNewPhone("");
    } catch (error) {
      console.error("Error updating phone number:", error);
    }
    setLoading(false);
  };

  const handleUpdatePassword = async () => {
    setLoading(true);
    try {
      await updatePassword(newPassword);
      setNewPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "users", currentUser.uid));
      await deleteUser();
    } catch (error) {
      console.error("Error deleting account:", error);
    }
    setLoading(false);
  };

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
          <p><strong>Phone:</strong> {userData.phone || "Not provided"}</p>
          <p><strong>Joined Events:</strong> {userData.joinedEvents.length}</p>
        </div>
        <div className="profile-actions">
          <h2>Update Profile</h2>
          <div className="form-group">
            <label>New Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button onClick={handleUpdateName} disabled={loading}>
              Update Name
            </button>
          </div>
          <div className="form-group">
            <label>New Phone Number</label>
            <input
              type="text"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
            <button onClick={handleUpdatePhone} disabled={loading}>
              Update Phone
            </button>
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleUpdatePassword} disabled={loading}>
              Update Password
            </button>
          </div>
          <div className="form-group">
            <button onClick={handleDeleteAccount} disabled={loading} className="delete-button">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;