import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const ANSWERS_API = `${REMOTE_SERVER}/api/piazza/answers`;

/**
 * Create a new answer
 * @param answer - The answer object to create
 * @returns Promise with the created answer
 */
export const createAnswer = async (answer: any) => {
    const response = await axiosWithCredentials.post(ANSWERS_API, answer);
    return response.data;
};

/**
 * Find answers for a specific post
 * @param postId - The ID of the post
 * @returns Promise with an array of answers
 */
export const findAnswersForPost = async (postId: string) => {
    const response = await axiosWithCredentials.get(`${ANSWERS_API}/post/${postId}`);
    return response.data;
};

/**
 * Find a specific answer by ID
 * @param answerId - The ID of the answer
 * @returns Promise with the answer
 */
export const findAnswerById = async (answerId: string) => {
    const response = await axiosWithCredentials.get(`${ANSWERS_API}/${answerId}`);
    return response.data;
};

/**
 * Update an existing answer
 * @param answerId - The ID of the answer to update
 * @param answer - The updated answer data
 * @returns Promise with the updated answer
 */
export const updateAnswer = async (answerId: string, answer: any) => {
    const response = await axiosWithCredentials.put(`${ANSWERS_API}/${answerId}`, answer);
    return response.data;
};

/**
 * Delete an answer
 * @param answerId - The ID of the answer to delete
 * @returns Promise with the deleted answer
 */
export const deleteAnswer = async (answerId: string) => {
    const response = await axiosWithCredentials.delete(`${ANSWERS_API}/${answerId}`);
    return response.data;
};