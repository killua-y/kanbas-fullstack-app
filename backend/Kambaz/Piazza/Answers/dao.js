import AnswerModel from "./model.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Data Access Object for Answer operations
 * Handles all database interactions for answers
 */

/**
 * Create a new answer
 * @param {Object} answer - The answer object to create
 * @returns {Promise<Object>} - The created answer
 */
export const createAnswer = async (answer) => {
  // Ensure the _id is a string
  const newAnswer = new AnswerModel({ 
    ...answer, 
    _id: answer._id || uuidv4() // Use provided ID or generate a new UUID
  });
  return await newAnswer.save();
};

/**
 * Find an answer by ID
 * @param {String} answerId - The ID of the answer to find
 * @returns {Promise<Object>} - The found answer or null
 */
export const findAnswerById = async (answerId) => {
  return await AnswerModel.findById(answerId);
};

/**
 * Find all answers for a post
 * @param {String} postId - The ID of the post
 * @returns {Promise<Array>} - Array of answers
 */
export const findAnswersForPost = async (postId) => {
  return await AnswerModel.find({ post: postId }).sort({ date: -1 });
};

/**
 * Update an answer
 * @param {String} answerId - The ID of the answer to update
 * @param {Object} updates - The updates to apply
 * @returns {Promise<Object>} - The updated answer
 */
export const updateAnswer = async (answerId, updates) => {
  return await AnswerModel.findByIdAndUpdate(
    answerId,
    { $set: updates },
    { new: true }
  );
};

/**
 * Delete an answer
 * @param {String} answerId - The ID of the answer to delete
 * @returns {Promise<Object>} - The deleted answer
 */
export const deleteAnswer = async (answerId) => {
  return await AnswerModel.findByIdAndDelete(answerId);
};