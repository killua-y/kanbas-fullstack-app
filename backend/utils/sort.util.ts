import { PopulatedDatabaseQuestion } from '../types/question';

/**
 * Gets the newest questions from a list, sorted by the asking date in descending order.
 *
 * @param {PopulatedDatabaseQuestion[]} qlist - The list of questions to sort
 *
 * @returns {PopulatedDatabaseQuestion[]} - The sorted list of questions by ask date, newest first
 */
export const sortQuestionsByNewest = (
  qlist: PopulatedDatabaseQuestion[],
): PopulatedDatabaseQuestion[] =>
  qlist.sort((a, b) => {
    if (a.askDateTime > b.askDateTime) {
      return -1;
    }

    if (a.askDateTime < b.askDateTime) {
      return 1;
    }

    return 0;
  });