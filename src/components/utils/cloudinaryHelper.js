import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
  api_secret: process.env.REACT_APP_CLOUDINARY_API_SECRET,
});

/**
 * Uploads an image to Cloudinary and returns the URL of the uploaded image.
 * @param {File} imageFile - The image file to be uploaded.
 * @param {string} publicId - (Optional) A custom public ID for the uploaded image in Cloudinary.
 * @returns {Promise<string>} - The URL of the uploaded image.
 */
export const uploadImage = async (imageFile, publicId = null) => {
  try {
    const options = publicId ? { public_id: publicId } : {};
    const uploadResult = await cloudinary.uploader.upload(
      imageFile.path,
      options
    );
    return uploadResult.secure_url; // Return the Cloudinary URL of the uploaded image
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
