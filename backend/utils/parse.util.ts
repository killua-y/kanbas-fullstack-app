/**
 * Parses folders from a search string. Folders are assumed to be enclosed in square brackets (e.g., "[folder1][folder2]").
 *
 * @param {string} search - A search string containing folders wrapped in square brackets.
 *
 * @returns {string[]} - An array of folders found in the search string. Each folder is a string without the square brackets.
 */
export const parseFolders = (search: string): string[] =>
  (search.match(/\[([^\]]+)\]/g) || []).map(word => word.slice(1, -1));

/**
 * Parses keywords from a search string by removing any folders (enclosed in square brackets) and returning individual words.
 *
 * @param {string} search - The search string that may contain both keywords and folders.
 *
 * @returns {string[]} - An array of keywords found in the search string, with folders removed. Each keyword is a word.
 */
export const parseKeyword = (search: string): string[] =>
  search.replace(/\[([^\]]+)\]/g, ' ').match(/\b\w+\b/g) || [];
