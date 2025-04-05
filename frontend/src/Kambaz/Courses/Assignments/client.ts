import axios from "axios";
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const ASSIGNMENTS_API = `${REMOTE_SERVER}/api/assignments`;

/**
 * Update an existing assignment by its ID
 */
export const updateAssignment = async (assignmentId: string, assignment: any) => {
  const response = await axios.put(`${ASSIGNMENTS_API}/${assignmentId}`, assignment);
  return response.data;
};

/**
 * Delete an assignment by its ID
 */
export const deleteAssignment = async (assignmentId: string) => {
  const response = await axios.delete(`${ASSIGNMENTS_API}/${assignmentId}`);
  return response.data;
};
