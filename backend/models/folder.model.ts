import mongoose, { Model } from 'mongoose';
import folderSchema from './schema/folder.schema';
import { DatabaseFolder } from '../types/folder';

/**
 * Mongoose model for the `Folder` collection.
 *
 * This model is created using the `Folder` interface and the `folderSchema`, representing the
 * `Folder` collection in the MongoDB database, and provides an interface for interacting with
 * the stored folders.
 *
 * @type {Model<DatabaseFolder>}
 */
const FolderModel: Model<DatabaseFolder> = mongoose.model<DatabaseFolder>('Folder', folderSchema);

export default FolderModel;
