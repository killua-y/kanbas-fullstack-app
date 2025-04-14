import ReplyModel from "./model.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Data Access Object for Reply operations
 * Handles all database interactions for replies
 */

/**
 * Create a new reply
 * @param {Object} reply - The reply object to create
 * @returns {Promise<Object>} - The created reply
 */
export const createReply = async (reply) => {
  const newReply = new ReplyModel({ ...reply, _id: reply._id || uuidv4() });
  return await newReply.save();
};

/**
 * Find a reply by ID
 * @param {String} replyId - The ID of the reply to find
 * @returns {Promise<Object>} - The found reply or null
 */
export const findReplyById = async (replyId) => {
  return await ReplyModel.findById(replyId);
};

/**
 * Find all replies for a discussion
 * @param {String} discussionId - The ID of the discussion
 * @returns {Promise<Array>} - Array of replies
 */
export const findRepliesForDiscussion = async (discussionId) => {
  return await ReplyModel.find({ discussion: discussionId }).sort({ date: 1 });
};

/**
 * Find all replies for a parent reply (nested replies)
 * @param {String} parentReplyId - The ID of the parent reply
 * @returns {Promise<Array>} - Array of replies
 */
export const findRepliesForParentReply = async (parentReplyId) => {
  return await ReplyModel.find({ parentReply: parentReplyId }).sort({ date: 1 });
};

/**
 * Update a reply
 * @param {String} replyId - The ID of the reply to update
 * @param {Object} updates - The updates to apply
 * @returns {Promise<Object>} - The updated reply
 */
export const updateReply = async (replyId, updates) => {
  return await ReplyModel.findByIdAndUpdate(
    replyId,
    { $set: updates },
    { new: true }
  );
};

/**
 * Delete a reply
 * @param {String} replyId - The ID of the reply to delete
 * @returns {Promise<Object>} - The deleted reply
 */
export const deleteReply = async (replyId) => {
  return await ReplyModel.findByIdAndDelete(replyId);
};