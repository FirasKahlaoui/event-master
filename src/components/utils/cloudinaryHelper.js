import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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

/**
 * Generates an optimized URL for an image stored in Cloudinary.
 * @param {string} publicId - The public ID of the image in Cloudinary.
 * @returns {string} - The optimized URL for the image.
 */
export const getOptimizedUrl = (publicId) => {
  return cloudinary.url(publicId, {
    fetch_format: "auto",
    quality: "auto",
  });
};

/**
 * Generates an auto-cropped URL for an image stored in Cloudinary.
 * @param {string} publicId - The public ID of the image in Cloudinary.
 * @returns {string} - The auto-cropped URL for the image.
 */
export const getAutoCropUrl = (publicId) => {
  return cloudinary.url(publicId, {
    crop: "auto",
    gravity: "auto",
    width: 500,
    height: 500,
  });
};
