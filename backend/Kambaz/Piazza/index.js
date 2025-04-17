import express from "express";
import postRoutes from "./Posts/routes.js";
import answerRoutes from "./Answers/routes.js";
import discussionRoutes from "./Discussions/routes.js";
import replyRoutes from "./Replies/routes.js";
import folderRoutes from "./Folders/routes.js";


const router = express.Router();

// Mount all routes under /api/piazza
router.use("/posts", postRoutes);
router.use("/answers", answerRoutes);
router.use("/discussions", discussionRoutes);
router.use("/replies", replyRoutes);
router.use("/folders", folderRoutes);

export default router; 