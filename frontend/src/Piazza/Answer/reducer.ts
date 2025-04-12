import { createSlice } from "@reduxjs/toolkit";

// Define answer interface
interface Answer {
    _id: string;
    post: string;
    text: string;
    author: string;
    date: Date;
    isInstructorAnswer: boolean;
    isEdited: boolean;
    editDate?: Date;
    editBy?: string;
}

// Define state interface
interface AnswersState {
    answers: Answer[];
    loading: boolean;
    error: string | null;
}

// Initial state
const initialState: AnswersState = {
    answers: [],
    loading: false,
    error: null,
};

// Create answers slice
const answersSlice = createSlice({
    name: "answers",
    initialState,
    reducers: {
        setAnswers: (state, action) => {
            state.answers = action.payload;
            state.loading = false;
            state.error = null;
        },
        addAnswer: (state, action) => {
            state.answers.push(action.payload);
            state.loading = false;
            state.error = null;
        },
        updateAnswer: (state, action) => {
            const index = state.answers.findIndex(answer => answer._id === action.payload._id);
            if (index !== -1) {
                state.answers[index] = action.payload;
            }
            state.loading = false;
            state.error = null;
        },
        deleteAnswer: (state, action) => {
            state.answers = state.answers.filter(answer => answer._id !== action.payload);
            state.loading = false;
            state.error = null;
        },
        setLoading: (state) => {
            state.loading = true;
            state.error = null;
        },
        setError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        clearAnswers: (state) => {
            state.answers = [];
            state.loading = false;
            state.error = null;
        }
    },
});

// Export actions
export const { 
    setAnswers, 
    addAnswer, 
    updateAnswer, 
    deleteAnswer,
    setLoading,
    setError,
    clearAnswers
} = answersSlice.actions;

// Export reducer
export default answersSlice.reducer;