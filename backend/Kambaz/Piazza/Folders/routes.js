import express from "express";
import {
  createFolder,
  findFolderById,
  findFoldersByCourse,
  findFoldersByPost,
  findFoldersByAuthor,
  findAllFolders, // Assuming you might want a route to get all folders
  updateFolder,
  deleteFolder
} from "./dao.js"; // Adjust path if needed

const router = express.Router();

/**
 * Create a new folder
 * POST /api/piazza/folders  (Assuming this base path in your app setup)
 */
router.post("/", async (req, res) => {
  try {
    // Add potential validation for req.body here if needed
    const folder = await createFolder(req.body);
    res.status(201).json(folder);
  } catch (error) {
    // Log the error for server-side debugging
    console.error("Error creating folder:", error);
    res.status(500).json({ message: `Error creating folder: ${error.message}` });
  }
});

/**
 * Get all folders (use with caution if there are many)
 * GET /api/piazza/folders
 */
router.get("/", async (req, res) => {
  try {
    const folders = await findAllFolders();
    res.json(folders);
  } catch (error) {
    console.error("Error finding all folders:", error);
    res.status(500).json({ message: `Error finding all folders: ${error.message}` });
  }
});


/**
 * Get all folders for a specific course
 * GET /api/piazza/folders/course/:courseId
 */
router.get("/course/:courseId", async (req, res) => {
  try {
    const folders = await findFoldersByCourse(req.params.courseId);
    // An empty array is a valid result, not necessarily a 404
    res.json(folders);
  } catch (error) {
    console.error(`Error finding folders for course ${req.params.courseId}:`, error);
    res.status(500).json({ message: `Error finding folders by course: ${error.message}` });
  }
});

/**
 * Get all folders for a specific post
 * GET /api/piazza/folders/post/:postId
 */
router.get("/post/:postId", async (req, res) => {
  try {
    const folders = await findFoldersByPost(req.params.postId);
    res.json(folders);
  } catch (error) {
    console.error(`Error finding folders for post ${req.params.postId}:`, error);
    res.status(500).json({ message: `Error finding folders by post: ${error.message}` });
  }
});

/**
 * Get all folders by a specific author
 * GET /api/piazza/folders/author/:authorId
 */
router.get("/author/:authorId", async (req, res) => {
  try {
    const folders = await findFoldersByAuthor(req.params.authorId);
    res.json(folders);
  } catch (error) {
    console.error(`Error finding folders for author ${req.params.authorId}:`, error);
    res.status(500).json({ message: `Error finding folders by author: ${error.message}` });
  }
});


/**
 * Get a folder by its ID
 * GET /api/piazza/folders/:folderId
 */
router.get("/:folderId", async (req, res) => {
  try {
    const folder = await findFolderById(req.params.folderId);
    if (!folder) {
      // Use return to stop execution after sending response
      return res.status(404).json({ message: "Folder not found" });
    }
    res.json(folder);
  } catch (error) {
    console.error(`Error finding folder ${req.params.folderId}:`, error);
    res.status(500).json({ message: `Error finding folder by ID: ${error.message}` });
  }
});


/**
 * Update a folder
 * PUT /api/piazza/folders/:folderId
 */
router.put("/:folderId", async (req, res) => {
  try {
    const folder = await updateFolder(req.params.folderId, req.body);
    if (!folder) {
      return res.status(404).json({ message: "Folder not found for update" });
    }
    res.json(folder);
  } catch (error) {
    console.error(`Error updating folder ${req.params.folderId}:`, error);
    res.status(500).json({ message: `Error updating folder: ${error.message}` });
  }
});

/**
 * Delete a folder
 * DELETE /api/piazza/folders/:folderId
 */
router.delete("/:folderId", async (req, res) => {
  try {
    const folder = await deleteFolder(req.params.folderId);
    if (!folder) {
      return res.status(404).json({ message: "Folder not found for deletion" });
    }
    res.json({ message: "Folder deleted successfully", deletedFolderId: folder._id });
  } catch (error) {
    console.error(`Error deleting folder ${req.params.folderId}:`, error);
    res.status(500).json({ message: `Error deleting folder: ${error.message}` });
  }
});

export default router;
