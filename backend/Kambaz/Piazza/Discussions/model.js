import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("DiscussionModel", schema);
export default model; 