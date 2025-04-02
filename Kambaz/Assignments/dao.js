import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Find all assignments for a specific course
 */
export function findAssignmentsForCourse(courseId) {
  const { assignments } = Database;
  return assignments.filter((assignment) => assignment.course === courseId);
}

/**
 * Create a new assignment
 */
export function createAssignment(assignment) {
  const newAssignment = { ...assignment, _id: uuidv4() };
  Database.assignments = [...Database.assignments, newAssignment];
  return newAssignment;
}

/**
 * Update an existing assignment by its ID
 */
export function updateAssignment(assignmentId, updatedFields) {
  const { assignments } = Database;
  const assignment = assignments.find(a => a._id === assignmentId);
  Object.assign(assignment, updatedFields);
  return assignment;
}

/**
 * Delete an assignment by its ID
 */
export function deleteAssignment(assignmentId) {
  const { assignments } = Database;
  Database.assignments = assignments.filter(a => a._id !== assignmentId); 
}
