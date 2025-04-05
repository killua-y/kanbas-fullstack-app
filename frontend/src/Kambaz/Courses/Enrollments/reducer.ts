import { createSlice } from "@reduxjs/toolkit";
import * as db from "../../Database";

// Initialize enrollments from the database
const initialState = {
  enrollments: db.enrollments
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    enroll: (state, action) => {
      state.enrollments.push(action.payload); // Add new enrollment
    },
    unenroll: (state, action) => {
      state.enrollments = state.enrollments.filter(
        (enrollment) =>
          enrollment.user !== action.payload.user ||
          enrollment.course !== action.payload.course
      );
    },
  },
});

// Export actions
export const { enroll, unenroll } = enrollmentsSlice.actions;

// Export reducer
export default enrollmentsSlice.reducer;
