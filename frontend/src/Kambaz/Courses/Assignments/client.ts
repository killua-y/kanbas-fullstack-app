import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const ASSIGNMENTS_API = `${REMOTE_SERVER}/api/assignments`;

/**
 * Delete an assignment by its ID
 */
export const deleteAssignment = async (assignmentId: string) => {
  const response = await axiosWithCredentials.delete(`${ASSIGNMENTS_API}/${assignmentId}`);
  return response.data;
};


/**
 * Update an existing assignment by its ID
 */
export const updateAssignment = async (assignmentId: string, assignment: any) => {
  const response = await axiosWithCredentials.put(`${ASSIGNMENTS_API}/${assignmentId}`, assignment);
  return response.data;
};

/**
 * Find an assignment by its ID
 */
export const findAssignmentById = async (assignmentId: string) => {
  const response = await axiosWithCredentials.get(`${ASSIGNMENTS_API}/${assignmentId}`);
  return response.data;
};