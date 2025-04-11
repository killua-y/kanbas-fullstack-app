import mongoose from "mongoose";

/**
 * Mongoose schema for the Answer collection.
 * 
 * This schema defines the structure for storing answers to posts in the database.
 * Each answer includes the following fields:
 * - `post`: Reference to the post this answer belongs to
 * - `text`: The content of the answer
 * - `author`: The user who wrote the answer
 * - `date`: When the answer was created
 * - `isInstructorAnswer`: Whether the answer is from an instructor
 * - `isEdited`: Whether the answer has been edited
 * - `editDate`: When the answer was last edited
 * - `editBy`: Who edited the answer
 */
const answerSchema = new mongoose.Schema(
  {
    post: { type: String, ref: "PostModel", required: true },
    text: { type: String, required: true },
    author: { type: String, ref: "UserModel", required: true },
    date: { type: Date, default: Date.now },
    isInstructorAnswer: { type: Boolean, default: false },
    isEdited: { type: Boolean, default: false },
    editDate: { type: Date },
    editBy: { type: String, ref: "UserModel" }
  },
  { collection: 'answers' }
);

export default answerSchema; 