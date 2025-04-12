import PostModel from "./model.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Data Access Object for Post operations
 * Handles all database interactions for posts
 */

/**
 * Create a new post
 * @param {Object} post - The post object to create
 * @returns {Promise<Object>} - The created post
 */
export const createPost = async (post) => {
  const newPost = new PostModel({ ...post, _id: uuidv4() });
  return await newPost.save();
};

/**
 * Find a post by ID
 * @param {String} postId - The ID of the post to find
 * @returns {Promise<Object>} - The found post or null
 */
export const findPostById = async (postId) => {
  return await PostModel.findById(postId);
};

/**
 * Find all posts for a course
 * @param {String} courseId - The ID of the course
 * @returns {Promise<Array>} - Array of posts
 */
export const findPostsForCourse = async (courseId) => {
  return await PostModel.find({ course: courseId }).sort({ date: -1 });
};

/**
 * Find posts by folder
 * @param {String} folderId - The ID of the folder
 * @returns {Promise<Array>} - Array of posts
 */
export const findPostsForFolder = async (folderId) => {
  return await PostModel.find({ folders: folderId }).sort({ date: -1 });
};

/**
 * Find posts by user
 * @param {String} userId - The ID of the user
 * @returns {Promise<Array>} - Array of posts
 */
export const findPostsByUser = async (userId) => {
  return await PostModel.find({ postBy: userId }).sort({ date: -1 });
};

/**
 * Find posts visible to a specific user
 * @param {String} userId - The ID of the user
 * @param {String} courseId - The ID of the course
 * @returns {Promise<Array>} - Array of posts
 */
export const findPostsVisibleToUser = async (userId, courseId) => {
  return await PostModel.find({
    $or: [
      { course: courseId, postTo: "course" },
      { individualRecipients: userId }
    ]
  }).sort({ date: -1 });
};

/**
 * Update a post
 * @param {String} postId - The ID of the post to update
 * @param {Object} updates - The updates to apply
 * @returns {Promise<Object>} - The updated post
 */
export const updatePost = async (postId, updates) => {
  return await PostModel.findByIdAndUpdate(
    postId,
    { $set: updates },
    { new: true }
  );
};

/**
 * Delete a post
 * @param {String} postId - The ID of the post to delete
 * @returns {Promise<Object>} - The deleted post
 */
export const deletePost = async (postId) => {
  return await PostModel.findByIdAndDelete(postId);
};

/**
 * Increment the view count of a post
 * @param {String} postId - The ID of the post
 * @returns {Promise<Object>} - The updated post
 */
export const incrementViewCount = async (postId) => {
  return await PostModel.findByIdAndUpdate(
    postId,
    { $inc: { viewCount: 1 } },
    { new: true }
  );
};

/**
 * Mark a post as read for a user
 * @param {String} postId - The ID of the post
 * @returns {Promise<Object>} - The updated post
 */
export const markPostAsRead = async (postId) => {
  return await PostModel.findByIdAndUpdate(
    postId,
    { $set: { isRead: true } },
    { new: true }
  );
};

/**
 * Toggle the resolved status of a post
 * @param {String} postId - The ID of the post
 * @returns {Promise<Object>} - The updated post
 */
export const toggleResolvedStatus = async (postId) => {
  const post = await PostModel.findById(postId);
  return await PostModel.findByIdAndUpdate(
    postId,
    { $set: { isResolved: !post.isResolved } },
    { new: true }
  );
};

/**
 * Toggle the pinned status of a post
 * @param {String} postId - The ID of the post
 * @returns {Promise<Object>} - The updated post
 */
export const togglePinnedStatus = async (postId) => {
  const post = await PostModel.findById(postId);
  return await PostModel.findByIdAndUpdate(
    postId,
    { $set: { isPinned: !post.isPinned } },
    { new: true }
  );
}; 