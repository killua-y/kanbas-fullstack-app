import mongoose from "mongoose";

/**
 * Mongoose schema for the Post collection.
 * 
 * This schema defines the structure for storing posts (questions and notes) in the database.
 * Posts are the main content type in the Piazza system, representing either questions from students
 * or informational notes from instructors.
 * 
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
 * - `viewCount`: Number of times the post has been viewed
 * - `isResolved`: Whether the post has been resolved
 * - `isPinned`: Whether the post is pinned
 * - `isRead`: Whether the post has been read
 */
const schema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        postType: {
            type: String,
            enum: ["question", "note"],
            default: "question"
        },
        postTo: {
            type: String,
            enum: ["course", "individual"],
            default: "course"
        },
        title: { type: String, required: true },
        text: { type: String, required: true },
        postBy: { type: String, ref: "UserModel", required: true },
        date: { type: Date, default: Date.now },
        course: { type: String, ref: "CourseModel", required: true },
        folders: [{ type: String, ref: "FolderModel" }],
        individualRecipients: [{ type: String, ref: "UserModel" }],
        viewCount: { type: Number, default: 0 },
        isResolved: { type: Boolean, default: false },
        isPinned: { type: Boolean, default: false },
        isRead: { type: Boolean, default: false }
    },
    { collection: "posts" }
)
export default schema;