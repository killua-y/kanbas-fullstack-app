import { DatabaseQuestion, Question } from '../types/question';
import { DatabaseFolder, Folder } from '../types/folder';
import QuestionModel from '../models/questions.model';
import FolderModel from '../models/folder.model';

/**
 * Checks if given question contains any folders from the given list.
 *
 * @param {Question} q - The question to check
 * @param {string[]} folderlist - The list of folders to check for
 *
 * @returns {boolean} - `true` if any folder is present in the question, `false` otherwise
 */
export const checkFolderInQuestion = (q: Question, folderlist: string[]): boolean => {
  for (const foldername of folderlist) {
    for (const folder of q.folders) {
      if (foldername === folder.name) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Adds a folder to the database if it does not already exist.
 *
 * @param {Folder} folder - The folder to add
 *
 * @returns {Promise<Folder | null>} - The added or existing folder, or `null` if an error occurred
 */
export const addFolder = async (folder: Folder): Promise<DatabaseFolder | null> => {
  try {
    // Check if a folder with the given name already exists
    const existingFolder: DatabaseFolder | null = await FolderModel.findOne({ name: folder.name });

    if (existingFolder) {
      return existingFolder;
    }

    // If the folder does not exist, create a new one
    const savedFolder: DatabaseFolder = await FolderModel.create(folder);

    return savedFolder;
  } catch (error) {
    return null;
  }
};

/**
 * Processes a list of folders by removing duplicates, checking for existing folders in the database,
 * and adding non-existing folders. Returns an array of the existing or newly added folders.
 * If an error occurs during the process, it is logged, and an empty array is returned.
 *
 * @param folders The array of Folder objects to be processed.
 *
 * @returns A Promise that resolves to an array of Folder objects.
 */
export const processFolders = async (folders: Folder[]): Promise<DatabaseFolder[]> => {
  try {
    // Extract unique folder names from the provided folders array using a Set to eliminate duplicates
    const uniqueFolderNamesSet: Set<string> = new Set(folders.map(folder => folder.name));

    // Create an array of unique Folder objects by matching folder names
    const uniqueFolders = [...uniqueFolderNamesSet].map(
      name => folders.find(folder => folder.name === name)!, // The '!' ensures the Folder is found, assuming no undefined values
    );

    // Use Promise.all to asynchronously process each unique folder.
    const processedFolders = await Promise.all(
      uniqueFolders.map(async folder => {
        const dbFolder = await addFolder(folder);

        if (dbFolder) {
          return dbFolder; // If the folder does not exist, attempt to add it to the database
        }

        // Throwing an error if addFolder fails
        throw new Error(`Error while adding folder: ${folder.name}`);
      }),
    );

    return processedFolders;
  } catch (error) {
    return [];
  }
};

/**
 * Gets a map of folders and their corresponding question counts.
 *
 * @returns {Promise<Map<string, number> | null | { error: string }>} - A map of folders to their
 *          counts, `null` if there are no folders in the database, or the error message.
 */
export const getFolderCountMap = async (): Promise<Map<string, number> | null | { error: string }> => {
  try {
    const flist: DatabaseFolder[] = await FolderModel.find();

    const qlist: (Omit<DatabaseQuestion, 'folders'> & { folders: DatabaseFolder[] })[] =
      await QuestionModel.find().populate<{
        folders: DatabaseFolder[];
      }>({
        path: 'folders',
        model: FolderModel,
      });

    if (!flist || flist.length === 0) {
      return null;
    }

    const fmap: Map<string, number> = new Map(flist.map(f => [f.name, 0]));

    if (qlist != null && qlist !== undefined && qlist.length > 0) {
      qlist.forEach(q => {
        q.folders.forEach(f => {
          fmap.set(f.name, (fmap.get(f.name) || 0) + 1);
        });
      });
    }

    return fmap;
  } catch (error) {
    return { error: 'Error when constructing folder map' };
  }
};
