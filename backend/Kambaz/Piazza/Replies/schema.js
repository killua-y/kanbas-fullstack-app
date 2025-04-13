import mongoose from "mongoose";

/**
 * Mongoose schema for the Reply collection.
 * 
 * This schema defines the structure for storing replies to discussions in the database.
 * Each reply includes the following fields:
 * - `discussion`: Reference to the discussion this reply belongs to
 * - `text`: The content of the reply
 * - `author`: The user who wrote the reply
 * - `date`: When the reply was created
 * - `isEdited`: Whether the reply has been edited
 * - `editDate`: When the reply was last edited
 * - `editBy`: Who edited the reply
 * - `parentReply`: Reference to the parent reply (for nested replies)
 */
const replySchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    discussion: { type: String, ref: "DiscussionModel", required: true },
    text: { type: String, required: true },
    author: { type: String, ref: "UserModel", required: true },
    date: { type: Date, default: Date.now },
    isEdited: { type: Boolean, default: false },
    editDate: { type: Date },
    editBy: { type: String, ref: "UserModel" },
    parentReply: { type: String, ref: "ReplyModel" }
  },
  { collection: 'replies' }
);

export default replySchema; 