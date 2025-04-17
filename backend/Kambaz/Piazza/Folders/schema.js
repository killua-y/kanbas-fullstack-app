import mongoose from "mongoose";

/**
 * Mongoose schema for the Folder collection.
 *
 * This schema defines the structure for storing folders in the database.
 * Each folder includes the following fields:
 * - `name`: The name of the folder. This field is required.
 * - `course`: Reference to the course this folder belongs to
 * - `order`: The order of the folder in the list
 * - `isDefault`: Whether this is a default folder
 */
const folderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    course: { type: String, ref: "CourseModel", required: true },
    order: { type: Number, default: 0 },
    isDefault: { type: Boolean, default: false }
  },
  { collection: 'folders' },
);

export default folderSchema;
