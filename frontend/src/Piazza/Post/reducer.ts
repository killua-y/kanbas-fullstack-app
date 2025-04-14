import { createSlice } from "@reduxjs/toolkit";

// Define post interface

/**
 * Each post includes the following fields:
 * - `_id`: Unique identifier for the post (UUID)
 * - `postType`: Type of post (question or note)
 * - `postTo`: Who the post is visible to (course or individual)
 * - `title`: Title of the post
 * - `text`: Content of the post
 * - `postBy`: User who created the post
 * - `date`: When the post was created
 * - `course`: Course the post belongs to
 * - `folders`: Folders the post belongs to
 * - `individualRecipients`: Users who can see the post (if postTo is "individual")
 * - `viewedBy`: Array of user IDs who have viewed the post
 * - `isResolved`: Whether the post has been resolved
 * - `isPinned`: Whether the post is pinned
 * - `isRead`: Whether the post has been read
 */
interface Post {
    _id: string;
    postType: string;
    postTo: string;
    title: string;
    text: string;
    postBy: string;
    date: Date;
    course: string;
    folders: string[];
    individualRecipients: string[];
    viewedBy: string[];
    isResolved: boolean;
    isPinned: boolean;
    isRead: boolean;
}

// Define state interface
interface PostsState {
    posts: Post[];
}

// Initial state from database
const initialState: PostsState = {
    posts: [],
};

// Create posts slice
const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        addPost: (state, action) => {
            state.posts.push(action.payload);
        },
        updatePost: (state, action) => {
            const index = state.posts.findIndex(post => post._id === action.payload._id);
            if (index !== -1) {
                state.posts[index] = action.payload;
            }
        },
        deletePost: (state, action) => {
            state.posts = state.posts.filter(post => post._id !== action.payload);
        },
        editPost: (state, action) => {
            const index = state.posts.findIndex(post => post._id === action.payload._id);
            if (index !== -1) {
                state.posts[index] = action.payload;
            }
        },
    },
});

// Export actions
export const { setPosts, addPost, updatePost, deletePost, editPost } = postsSlice.actions;

// Export reducer
export default postsSlice.reducer;
