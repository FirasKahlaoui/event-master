import { useState } from "react";
import { db } from "../../firebase/firebase";
import { addDoc, collection } from "firebase/firestore";
import { uploadImage } from "../utils/cloudinaryHelper";

const CreateEvent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !date || !location || !imageFile) {
      alert("Please fill in all fields and select an image.");
      return;
    }

    try {
      // Upload image to Cloudinary
      const uploadedImage = await uploadImage(imageFile); // This returns the image URL from Cloudinary

      // Save event details to Firestore with the image URL from Cloudinary
      const newEvent = {
        title,
        description,
        date,
        location,
        image: uploadedImage, // The Cloudinary URL of the image
      };
      await addDoc(collection(db, "events"), newEvent);

      alert("Event created successfully!");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
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
      <button type="submit">Create Event</button>
    </form>
  );
};

export default CreateEvent;
