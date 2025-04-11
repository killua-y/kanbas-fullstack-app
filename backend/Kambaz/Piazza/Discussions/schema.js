import mongoose from "mongoose";

/**
 * Mongoose schema for the Discussion collection.
 * 
 * This schema defines the structure for storing follow-up discussions in the database.
 * Each discussion includes the following fields:
 * - `post`: Reference to the post this discussion belongs to
 * - `text`: The content of the discussion
 * - `author`: The user who wrote the discussion
 * - `date`: When the discussion was created
 * - `isResolved`: Whether the discussion has been resolved
 * - `isEdited`: Whether the discussion has been edited
 * - `editDate`: When the discussion was last edited
 * - `editBy`: Who edited the discussion
 * - `parentDiscussion`: Reference to the parent discussion (for nested replies)
 * - `parentReply`: Reference to the parent reply (for nested replies)
 */
const discussionSchema = new mongoose.Schema(
  {
    post: { type: String, ref: "PostModel", required: true },
    text: { type: String, required: true },
    author: { type: String, ref: "UserModel", required: true },
    date: { type: Date, default: Date.now },
    isResolved: { type: Boolean, default: false },
    isEdited: { type: Boolean, default: false },
    editDate: { type: Date },
    editBy: { type: String, ref: "UserModel" },
    parentDiscussion: { type: String, ref: "DiscussionModel" },
    parentReply: { type: String, ref: "ReplyModel" }
  },
  { collection: 'discussions' }
);

export default discussionSchema; 