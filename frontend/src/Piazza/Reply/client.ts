import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const REPLIES_API = `${REMOTE_SERVER}/api/piazza/replies`;

/**
 * Create a new reply
 * @param reply - The reply object to create
 * @returns Promise with the created reply
 */
export const createReply = async (reply: any) => {
  const response = await axiosWithCredentials.post(REPLIES_API, reply);
  return response.data;
};

/**
 * Find replies for a specific discussion
 * @param discussionId - The ID of the discussion
 * @returns Promise with an array of replies
 */
export const findRepliesForDiscussion = async (discussionId: string) => {
  const response = await axiosWithCredentials.get(`${REPLIES_API}/discussion/${discussionId}`);
  return response.data;
};

/**
 * Find a specific reply by ID
 * @param replyId - The ID of the reply
 * @returns Promise with the reply
 */
export const findReplyById = async (replyId: string) => {
  const response = await axiosWithCredentials.get(`${REPLIES_API}/${replyId}`);
  return response.data;
};

/**
 * Update an existing reply
 * @param replyId - The ID of the reply to update
 * @param reply - The updated reply data
 * @returns Promise with the updated reply
 */
export const updateReply = async (replyId: string, reply: any) => {
  const response = await axiosWithCredentials.put(`${REPLIES_API}/${replyId}`, reply);
  return response.data;
};

/**
 * Delete a reply
 * @param replyId - The ID of the reply to delete
 * @returns Promise with the deleted reply
 */
export const deleteReply = async (replyId: string) => {
  const response = await axiosWithCredentials.delete(`${REPLIES_API}/${replyId}`);
  return response.data;
};