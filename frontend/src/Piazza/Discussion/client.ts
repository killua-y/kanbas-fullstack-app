import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const DISCUSSIONS_API = `${REMOTE_SERVER}/api/piazza/discussions`;

/**
 * Create a new discussion
 * @param discussion - The discussion object to create
 * @returns Promise with the created discussion
 */
export const createDiscussion = async (discussion: any) => {
  const response = await axiosWithCredentials.post(DISCUSSIONS_API, discussion);
  return response.data;
};

/**
 * Find discussions for a specific post
 * @param postId - The ID of the post
 * @returns Promise with an array of discussions
 */
export const findDiscussionsForPost = async (postId: string) => {
  const response = await axiosWithCredentials.get(`${DISCUSSIONS_API}/post/${postId}`);
  return response.data;
};

/**
 * Find a specific discussion by ID
 * @param discussionId - The ID of the discussion
 * @returns Promise with the discussion
 */
export const findDiscussionById = async (discussionId: string) => {
  const response = await axiosWithCredentials.get(`${DISCUSSIONS_API}/${discussionId}`);
  return response.data;
};

/**
 * Update an existing discussion
 * @param discussionId - The ID of the discussion to update
 * @param discussion - The updated discussion data
 * @returns Promise with the updated discussion
 */
export const updateDiscussion = async (discussionId: string, discussion: any) => {
  const response = await axiosWithCredentials.put(`${DISCUSSIONS_API}/${discussionId}`, discussion);
  return response.data;
};

/**
 * Toggle the resolved status of a discussion
 * @param discussionId - The ID of the discussion
 * @returns Promise with the updated discussion
 */
export const toggleResolvedStatus = async (discussionId: string) => {
  const response = await axiosWithCredentials.put(`${DISCUSSIONS_API}/${discussionId}/resolved`);
  return response.data;
};

/**
 * Delete a discussion
 * @param discussionId - The ID of the discussion to delete
 * @returns Promise with the deleted discussion
 */
export const deleteDiscussion = async (discussionId: string) => {
  const response = await axiosWithCredentials.delete(`${DISCUSSIONS_API}/${discussionId}`);
  return response.data;
};