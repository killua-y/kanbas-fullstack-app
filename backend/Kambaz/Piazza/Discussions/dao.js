import DiscussionModel from "./model.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Data Access Object for Discussion operations
 * Handles all database interactions for discussions
 */

/**
 * Create a new discussion
 * @param {Object} discussion - The discussion object to create
 * @returns {Promise<Object>} - The created discussion
 */
export const createDiscussion = async (discussion) => {
  const newDiscussion = new DiscussionModel({ ...discussion, _id: uuidv4() });
  return await newDiscussion.save();
};

/**
 * Find a discussion by ID
 * @param {String} discussionId - The ID of the discussion to find
 * @returns {Promise<Object>} - The found discussion or null
 */
export const findDiscussionById = async (discussionId) => {
  return await DiscussionModel.findById(discussionId);
};

/**
 * Find all discussions for a post
 * @param {String} postId - The ID of the post
 * @returns {Promise<Array>} - Array of discussions
 */
export const findDiscussionsForPost = async (postId) => {
  return await DiscussionModel.find({ post: postId, parentDiscussion: null }).sort({ date: -1 });
};

/**
 * Find nested discussions (replies to discussions)
 * @param {String} parentDiscussionId - The ID of the parent discussion
 * @returns {Promise<Array>} - Array of discussions
 */
export const findNestedDiscussions = async (parentDiscussionId) => {
  return await DiscussionModel.find({ parentDiscussion: parentDiscussionId }).sort({ date: 1 });
};

/**
 * Update a discussion
 * @param {String} discussionId - The ID of the discussion to update
 * @param {Object} updates - The updates to apply
 * @returns {Promise<Object>} - The updated discussion
 */
export const updateDiscussion = async (discussionId, updates) => {
  return await DiscussionModel.findByIdAndUpdate(
    discussionId,
    { $set: updates },
    { new: true }
  );
};

/**
 * Toggle the resolved status of a discussion
 * @param {String} discussionId - The ID of the discussion
 * @returns {Promise<Object>} - The updated discussion
 */
export const toggleResolvedStatus = async (discussionId) => {
  const discussion = await DiscussionModel.findById(discussionId);
  return await DiscussionModel.findByIdAndUpdate(
    discussionId,
    { $set: { isResolved: !discussion.isResolved } },
    { new: true }
  );
};

/**
 * Delete a discussion
 * @param {String} discussionId - The ID of the discussion to delete
 * @returns {Promise<Object>} - The deleted discussion
 */
export const deleteDiscussion = async (discussionId) => {
  return await DiscussionModel.findByIdAndDelete(discussionId);
};