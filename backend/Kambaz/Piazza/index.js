import express from "express";
import postRoutes from "./Posts/routes.js";
// import answerRoutes from "./Answers/routes.js";
// import folderRoutes from "./Folders/routes.js";


const router = express.Router();

// Mount all routes under /api/piazza
router.use("/posts", postRoutes);
// router.use("/answers", answerRoutes);
// router.use("/folders", folderRoutes);

export default router; 