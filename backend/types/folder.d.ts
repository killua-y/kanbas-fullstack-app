import { ObjectId } from 'mongodb';

/**
 * Represents a folder used for categorizing content.
 * - `name`: The name of the folder.
 * - `description`: A brief description of the folder's purpose or usage.
 */
export interface Folder {
  name: string;
  description: string;
}

/**
 * Interface represents the data for a folder.
 *
 * name - The name of the folder.
 * qcnt - The number of questions associated with the folder.
 */
export interface FolderData {
  name: string;
  qcnt: number;
}

/**
 * Represents a folder in the database with a unique identifier.
 * - `name`: The name of the folder.
 * - `description`: A brief description of the folder's purpose or usage.
 * - `_id`: The unique identifier for the folder.
 */
export interface DatabaseFolder extends Folder {
  _id: ObjectId;
}
