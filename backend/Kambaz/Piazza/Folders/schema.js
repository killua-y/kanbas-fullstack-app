import mongoose from "mongoose";

/**
 * Mongoose schema for the Folder collection.
 *
 * This schema defines the structure for storing folders in the database.
 * Each folder includes the following fields:
 * - `name`: The name of the folder. This field is required.
 * - `author`: The user who create the folder
 * - `course`: Reference to the course this folder belongs to
 * - `editBy`: Who edited the folder
 */
const folderSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    author: { type: String, ref: "UserModel", required: true },
    course: { type: String, ref: "CourseModel", required: true },
    editBy: { type: String, ref: "UserModel" },
  },
  { collection: 'folders' },
);

export default folderSchema;
