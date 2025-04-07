import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Folder collection.
 *
 * This schema defines the structure for storing folders in the database.
 * Each folder includes the following fields:
 * - `name`: The name of the folder. This field is required.
 * - `description`: A brief description of the folder. This field is required.
 */
const folderSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { collection: 'Folder' },
);

export default folderSchema;
