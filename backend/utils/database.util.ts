import { PopulatedDatabaseQuestion } from '../types/question';
import { DatabaseFolder } from '../types/folder';

import QuestionModel from '../models/questions.model';
import FolderModel from '../models/folder.model';

/**
 * Fetches and populates a question document with its related folders.
 *
 * @param {string} questionID - The ID of the question to fetch.
 * @returns {Promise<PopulatedDatabaseQuestion | null>} - The populated question document, or null if not found.
 */
const populateQuestion = async (questionID: string): Promise<PopulatedDatabaseQuestion | null> => {
  const result = await QuestionModel.findOne({ _id: questionID }).populate<{
    folders: DatabaseFolder[];
  }>([
    { path: 'folders', model: FolderModel },
  ]);

  return result;
};

/**
 * Fetches and populates a question document based on the provided ID and type.
 *
 * @param {string | undefined} id - The ID of the document to fetch.
 * @param {'question'} type - Specifies the type of document to fetch.
 * @returns {Promise<QuestionResponse>} - A promise resolving to the populated document or an error message if the operation fails.
 */
// eslint-disable is for testing purposes only, so that Jest spy functions can be used.
// eslint-disable-next-line import/prefer-default-export
export const populateDocument = async (
  id: string,
  type: 'question',
): Promise<
  PopulatedDatabaseQuestion | { error: string }
> => {
  try {
    if (!id) {
      throw new Error('Provided ID is undefined.');
    }

    let result: PopulatedDatabaseQuestion | null = null;

    switch (type) {
      case 'question':
        result = await populateQuestion(id);
        break;
      default:
        throw new Error('Invalid type provided.');
    }

    if (!result) {
      throw new Error(`Failed to fetch and populate ${type} with ID: ${id}`);
    }

    return result;
  } catch (error) {
    return { error: `Error when fetching and populating a document: ${(error as Error).message}` };
  }
};
