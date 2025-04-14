import { createSlice } from "@reduxjs/toolkit";

// Define discussion interface
interface Discussion {
  _id: string;
  post: string;
  text: string;
  author: string;
  date: Date;
  isResolved: boolean;
  isEdited: boolean;
  editDate?: Date;
  editBy?: string;
  parentDiscussion?: string;
}

// Define state interface
interface DiscussionsState {
  discussions: Discussion[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: DiscussionsState = {
  discussions: [],
  loading: false,
  error: null,
};

// Create discussions slice
const discussionsSlice = createSlice({
  name: "discussions",
  initialState,
  reducers: {
    setDiscussions: (state, action) => {
      state.discussions = action.payload;
      state.loading = false;
      state.error = null;
    },
    addDiscussion: (state, action) => {
      state.discussions.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    updateDiscussion: (state, action) => {
      const index = state.discussions.findIndex(discussion => discussion._id === action.payload._id);
      if (index !== -1) {
        state.discussions[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    deleteDiscussion: (state, action) => {
      state.discussions = state.discussions.filter(discussion => discussion._id !== action.payload);
      state.loading = false;
      state.error = null;
    },
    toggleResolvedStatus: (state, action) => {
      const index = state.discussions.findIndex(discussion => discussion._id === action.payload._id);
      if (index !== -1) {
        state.discussions[index] = action.payload;
      }
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
    clearDiscussions: (state) => {
      state.discussions = [];
      state.loading = false;
      state.error = null;
    }
  },
});

// Export actions
export const { 
  setDiscussions, 
  addDiscussion, 
  updateDiscussion, 
  deleteDiscussion,
  toggleResolvedStatus,
  setLoading,
  setError,
  clearDiscussions
} = discussionsSlice.actions;

// Export reducer
export default discussionsSlice.reducer;