// src/components/utils/cloudinaryHelper.js
import dotenv from "dotenv";

dotenv.config();

const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Uploads an image to Cloudinary and returns the URL of the uploaded image.
 * @param {File} imageFile - The image file to be uploaded.
 * @returns {Promise<string>} - The URL of the uploaded image.
 */
export const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("upload_preset", "your_upload_preset"); // Replace with your upload preset

  try {
    const response = await fetch(cloudinaryUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.secure_url; // Return the Cloudinary URL of the uploaded image
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
