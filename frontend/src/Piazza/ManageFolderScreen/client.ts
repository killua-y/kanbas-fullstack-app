
import axios from "axios";
// Ensure you have a mechanism to include credentials if needed across domains
const axiosWithCredentials = axios.create({ withCredentials: true });

// Ensure VITE_REMOTE_SERVER is defined in your .env file for Vite projects
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const FOLDERS_API = `${REMOTE_SERVER}/api/piazza/folders`; // Adjusted base API endpoint

/**
 * Create a new folder
 * @param folder - The folder object to create (should match backend schema requirements: name, author, post, course)
 * @returns Promise with the created folder data
 */
export const createFolder = async (folder: any) => {
    const response = await axiosWithCredentials.post(FOLDERS_API, folder);
    return response.data;
};

/**
 * Find all folders (potentially large response)
 * @returns Promise with an array of all folders
 */
export const findAllFolders = async () => {
    const response = await axiosWithCredentials.get(FOLDERS_API);
    return response.data;
};


/**
 * Find folders for a specific course
 * @param courseId - The ID of the course
 * @returns Promise with an array of folders belonging to the course
 */
export const findFoldersByCourse = async (courseId: string) => {
    const response = await axiosWithCredentials.get(`${FOLDERS_API}/course/${courseId}`);
    return response.data;
};

/**
 * Find folders for a specific post
 * @param postId - The ID of the post
 * @returns Promise with an array of folders belonging to the post
 */
export const findFoldersByPost = async (postId: string) => {
    const response = await axiosWithCredentials.get(`${FOLDERS_API}/post/${postId}`);
    return response.data;
};

/**
 * Find folders by a specific author (user)
 * @param authorId - The ID of the author
 * @returns Promise with an array of folders created by the author
 */
export const findFoldersByAuthor = async (authorId: string) => {
    const response = await axiosWithCredentials.get(`${FOLDERS_API}/author/${authorId}`);
    return response.data;
};


/**
 * Find a specific folder by its ID
 * @param folderId - The ID of the folder
 * @returns Promise with the folder data
 */
export const findFolderById = async (folderId: string) => {
    const response = await axiosWithCredentials.get(`${FOLDERS_API}/${folderId}`);
    return response.data;
};

/**
 * Update an existing folder
 * @param folderId - The ID of the folder to update
 * @param folder - The updated folder data (e.g., { name: 'New Name', editBy: 'userId' })
 * @returns Promise with the updated folder data
 */
export const updateFolder = async (folderId: string, folder: any) => {
    const response = await axiosWithCredentials.put(`${FOLDERS_API}/${folderId}`, folder);
    return response.data;
};

/**
 * Delete a folder
 * @param folderId - The ID of the folder to delete
 * @returns Promise with the deletion result (often a confirmation message or the deleted object info)
 */
export const deleteFolder = async (folderId: string) => {
    const response = await axiosWithCredentials.delete(`${FOLDERS_API}/${folderId}`);
    return response.data;
};

// Define a basic Folder type (optional but recommended for better type safety)
// Adjust fields based on what the API actually returns
export interface Folder {
    _id: string;
    name: string;
    author: string; // or maybe a User object if populated
    post: string;   // or maybe a Post object if populated
    course: string; // or maybe a Course object if populated
    editBy?: string; // Optional field
    // Add any other fields returned by your API like timestamps (createdAt, updatedAt)
}

// Example usage with the interface (optional):
// export const createFolderTyped = async (folder: Partial<Folder>): Promise<Folder> => {
//     const response = await axiosWithCredentials.post<Folder>(FOLDERS_API, folder);
//     return response.data;
// };
