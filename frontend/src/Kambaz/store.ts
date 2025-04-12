import { configureStore } from "@reduxjs/toolkit";
import modulesReducer from "./Courses/Modules/reducer";
import accountReducer from "./Account/reducer";
import assignmentsReducer from "./Courses/Assignments/reducer"
import enrollmentsReducer from "./Courses/Enrollments/reducer";
import postsReducer from "../Piazza/Post/reducer";
import answersReducer from "../Piazza/Answer/reducer";

const store = configureStore({
  reducer: {
    modulesReducer,
    accountReducer,
    assignmentsReducer,
    enrollmentsReducer,
    postsReducer,
    answersReducer,
  },
});
export default store;