import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

// Define Assignment interface
interface Assignment {
  _id: string;
  title: string;
  description: string;
  availableFrom: string;
  dueDate: string;
  points: number;
  course: string;
  [key: string]: any; // Allow for other properties
}

// Define state interface
interface AssignmentsState {
  assignments: Assignment[];
}

// Initial state from database
const initialState: AssignmentsState = {
  assignments: []
};

// Create assignments slice
const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    setAssignment: (state, action) => {
      state.assignments = action.payload;
    },

    // Add new assignment
    addAssignment: (state, { payload: assignment }) => {
      const newAssignment: Assignment = {
        _id: uuidv4(),
        name: assignment.name,
        course: assignment.course,
        // Add required properties with default values
        title: assignment.title || "",
        description: assignment.description || "",
        availableFrom: assignment.availableFrom || "",
        dueDate: assignment.dueDate || "",
        points: assignment.points || 0,
      };
      state.assignments.push(newAssignment);
    },

    // Update an assignment by ID
    updateAssignment: (state, { payload: assignment }) => { 
      state.assignments = state.assignments.map((a: Assignment) =>
        a._id === assignment._id ? assignment : a
      );
    },

    // Delete an assignment by ID
    deleteAssignment: (state, { payload: assignmentId }) => {
      state.assignments = state.assignments.filter((a: Assignment) => a._id !== assignmentId);
    },

    // Edit an assignment by ID
    editAssignment: (state, { payload: assignmentId }) => {
      state.assignments = state.assignments.map((a: Assignment) =>
        a._id === assignmentId ? { ...a, editing: true } : a
      );
    }
  }
});

// Export actions
export const { addAssignment, updateAssignment, deleteAssignment, setAssignment, editAssignment } = assignmentsSlice.actions;

// Export reducer
export default assignmentsSlice.reducer;
