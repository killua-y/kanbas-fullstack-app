import { createSlice } from "@reduxjs/toolkit";

// Define reply interface
interface Reply {
  _id: string;
  discussion: string;
  text: string;
  author: string;
  date: Date;
  isEdited: boolean;
  editDate?: Date;
  editBy?: string;
  parentReply?: string;
}

// Define state interface
interface RepliesState {
  replies: Reply[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: RepliesState = {
  replies: [],
  loading: false,
  error: null,
};

// Create replies slice
const repliesSlice = createSlice({
  name: "replies",
  initialState,
  reducers: {
    setReplies: (state, action) => {
      state.replies = action.payload;
      state.loading = false;
      state.error = null;
    },
    addReply: (state, action) => {
      state.replies.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    updateReply: (state, action) => {
      const index = state.replies.findIndex(reply => reply._id === action.payload._id);
      if (index !== -1) {
        state.replies[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    deleteReply: (state, action) => {
      state.replies = state.replies.filter(reply => reply._id !== action.payload);
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
    clearReplies: (state) => {
      state.replies = [];
      state.loading = false;
      state.error = null;
    }
  },
});

// Export actions
export const { 
  setReplies, 
  addReply, 
  updateReply, 
  deleteReply,
  setLoading,
  setError,
  clearReplies
} = repliesSlice.actions;

// Export reducer
export default repliesSlice.reducer;