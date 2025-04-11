import mongoose from "mongoose";
const schema = new mongoose.Schema(
    {
        _id: String,
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
        title: { type: String, required: true, maxLength: 100 },
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