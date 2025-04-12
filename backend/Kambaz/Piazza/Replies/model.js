import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("ReplyModel", schema);
export default model; 