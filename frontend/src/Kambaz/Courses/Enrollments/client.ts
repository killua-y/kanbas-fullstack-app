import axios from "axios";

// Create an axios instance with credentials for session-based auth
const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const ENROLLMENTS_API = `${REMOTE_SERVER}/api/enrollments`;

/**
 * Enroll the current user in a course
 */
export const enrollInCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.post(`${ENROLLMENTS_API}/${courseId}`);
  return response.data;
};

/**
 * Unenroll the current user from a course
 */
export const unenrollFromCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.delete(`${ENROLLMENTS_API}/${courseId}`);
  return response.data;
}; 