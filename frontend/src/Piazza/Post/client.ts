import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const POSTS_API = `${REMOTE_SERVER}/api/piazza/posts`;

export const createPost = async (post: any) => {
    const response = await axiosWithCredentials.post(POSTS_API, post);
    return response.data;
}

export const findPostsForCourse = async (courseId: string) => {
    const response = await axiosWithCredentials.get(`${POSTS_API}/course/${courseId}`);
    return response.data;
}

export const findPostById = async (postId: string) => {
    const response = await axiosWithCredentials.get(`${POSTS_API}/${postId}`);
    return response.data;
}

export const findPostsForFolder = async (folderId: string) => {
    const response = await axiosWithCredentials.get(`${POSTS_API}/folder/${folderId}`);
    return response.data;
}

/**
 * View a post with a user ID, which adds the user to the post's viewedBy list
 * @param postId The ID of the post to view
 * @param userId The ID of the user viewing the post
 * @returns The updated post
 */
export const viewPost = async (postId: string, userId: string) => {
    const response = await axiosWithCredentials.get(`${POSTS_API}/${postId}?userId=${userId}`);
    return response.data;
}

export const updatePost = async (postId: string, post: any) => {
    const response = await axiosWithCredentials.put(`${POSTS_API}/${postId}`, post);
    return response.data;
}

export const deletePost = async (postId: string) => {
    const response = await axiosWithCredentials.delete(`${POSTS_API}/${postId}`);
    return response.data;
}

export const markPostAsRead = async (postId: string) => {
    const response = await axiosWithCredentials.put(`${POSTS_API}/${postId}/read`);
    return response.data;
}

export const toggleResolvedStatus = async (postId: string) => {
    const response = await axiosWithCredentials.put(`${POSTS_API}/${postId}/resolved`);
    return response.data;
}

export const togglePinnedStatus = async (postId: string) => {
    const response = await axiosWithCredentials.put(`${POSTS_API}/${postId}/pinned`);
    return response.data;
}


