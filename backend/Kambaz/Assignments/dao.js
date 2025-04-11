import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Find all assignments for a specific course
 */
export function findAssignmentsForCourse(courseId) {
  return model.find({ course: courseId });
}

/**
 * Create a new assignment
 */
export function createAssignment(assignment) {
  const newAssignment = { ...assignment, _id: uuidv4() };
  return model.create(newAssignment);
};

/**
 * Update an existing assignment by its ID
 */
export function updateAssignment(assignmentId, updatedFields) {
  return model.updateOne({ _id: assignmentId }, { $set: updatedFields });
};

/**
 * Delete an assignment by its ID
 */
export function deleteAssignment(assignmentId) {
  return model.deleteOne({ _id: assignmentId });
};

/**
 * Find an assignment by its ID
 */
export function findAssignmentById(assignmentId) {
  return model.findById(assignmentId);
};