import { v4 as uuidv4 } from "uuid";
import FolderModel from "./model.js";

// --- Model Compilation ---
// NOTE: Mongoose models are typically compiled once.
// You might do this in a central models/index.js file or here.
// If the model is compiled elsewhere, import the compiled model directly.
// Example: import FolderModel from './folderModel.js';
// For this example, let's compile it here:
// const FolderModel = mongoose.models.Folder || mongoose.model("Folder", folderSchema);
// `mongoose.models.Folder` checks if it's already compiled

/**
 * Data Access Object for Folder operations
 * Handles all database interactions for folders
 */

/**
 * Create a new folder
 * @param {Object} folder - The folder object to create (should match schema: name, author, post, course)
 * @returns {Promise<Object>} - The created folder document
 */
export const createFolder = async (folder) => {
  // Ensure the _id is a string and generate if not provided
  const newFolder = new FolderModel({
    ...folder,
    _id: folder._id || uuidv4(), // Use provided ID or generate a new UUID
  });
  return await newFolder.save();
};

/**
 * Find a folder by its ID
 * @param {String} folderId - The ID of the folder to find
 * @returns {Promise<Object|null>} - The found folder document or null if not found
 */
export const findFolderById = async (folderId) => {
  return await FolderModel.findById(folderId);
};

/**
 * Find all folders associated with a specific course
 * @param {String} courseId - The ID of the course
 * @returns {Promise<Array<Object>>} - Array of folder documents for the course, sorted by name
 */
export const findFoldersByCourse = async (courseId) => {
  return await FolderModel.find({ course: courseId }).sort({ name: 1 }); // Sort alphabetically by name
};

/**
 * Find all folders associated with a specific post
 * @param {String} postId - The ID of the post
 * @returns {Promise<Array<Object>>} - Array of folder documents for the post, sorted by name
 */
export const findFoldersByPost = async (postId) => {
  return await FolderModel.find({ post: postId }).sort({ name: 1 }); // Sort alphabetically by name
};

/**
 * Find all folders created by a specific author
 * @param {String} authorId - The ID of the author (user)
 * @returns {Promise<Array<Object>>} - Array of folder documents created by the author, sorted by name
 */
export const findFoldersByAuthor = async (authorId) => {
  return await FolderModel.find({ author: authorId }).sort({ name: 1 }); // Sort alphabetically by name
};

/**
 * Find all folders (use with caution, might return many documents)
 * @returns {Promise<Array<Object>>} - Array of all folder documents, sorted by name
 */
export const findAllFolders = async () => {
  return await FolderModel.find({}).sort({ name: 1 }); // Sort alphabetically by name
};


/**
 * Update a folder's details
 * @param {String} folderId - The ID of the folder to update
 * @param {Object} updates - The updates to apply (e.g., { name: 'New Name', editBy: 'userId' })
 * @returns {Promise<Object|null>} - The updated folder document or null if not found
 */
export const updateFolder = async (folderId, updates) => {
  return await FolderModel.findByIdAndUpdate(
    folderId,
    { $set: updates }, // Use $set to apply specific updates
    { new: true }      // Return the updated document
  );
};

/**
 * Delete a folder by its ID
 * @param {String} folderId - The ID of the folder to delete
 * @returns {Promise<Object|null>} - The deleted folder document or null if not found
 */
export const deleteFolder = async (folderId) => {
  return await FolderModel.findByIdAndDelete(folderId);
};

// You could add more specific find functions if needed, e.g., findFolderByNameAndCourse, etc.
