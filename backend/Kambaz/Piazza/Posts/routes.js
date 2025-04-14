import express from "express";
import {
  createPost,
  findPostById,
  findPostsForCourse,
  findPostsForFolder,
  findPostsByUser,
  findPostsVisibleToUser,
  updatePost,
  deletePost,
  addUserToViewedBy,
  markPostAsRead,
  toggleResolvedStatus,
  togglePinnedStatus
} from "./dao.js";

const router = express.Router();

/**
 * Create a new post
 * POST /api/piazza/posts
 */
router.post("/", async (req, res) => {
  try {
    const post = await createPost(req.body);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// router.post("/:courseId/posts", async (req, res) => {
//     const { courseId } = req.params;
//     const post = {
//         ...req.body,
//         course: courseId,
//     };
//     const newPost = await createPost(post);
//     res.json(newPost);
// });

/**
 * Get all posts for a course
 * GET /api/piazza/posts/course/:courseId
 */
router.get("/course/:courseId", async (req, res) => {
  try {
    const posts = await findPostsForCourse(req.params.courseId);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get a post by ID and record the view
 * GET /api/piazza/posts/:postId?userId=:userId
 */
router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: "userId query parameter is required" });
    }
    
    const post = await findPostById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Add user to viewedBy list
    await addUserToViewedBy(postId, userId);
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get all posts in a folder
 * GET /api/piazza/posts/folder/:folderId
 */
router.get("/folder/:folderId", async (req, res) => {
  try {
    const posts = await findPostsForFolder(req.params.folderId);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get all posts by a user
 * GET /api/piazza/posts/user/:userId
 */
router.get("/user/:userId", async (req, res) => {
  try {
    const posts = await findPostsByUser(req.params.userId);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get all posts visible to a user in a course
 * GET /api/piazza/posts/visible/:userId/:courseId
 */
router.get("/visible/:userId/:courseId", async (req, res) => {
  try {
    const posts = await findPostsVisibleToUser(req.params.userId, req.params.courseId);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Update a post
 * PUT /api/piazza/posts/:postId
 */
router.put("/:postId", async (req, res) => {
  try {
    const post = await updatePost(req.params.postId, req.body);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Delete a post
 * DELETE /api/piazza/posts/:postId
 */
router.delete("/:postId", async (req, res) => {
  try {
    const post = await deletePost(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Mark a post as read
 * PUT /api/piazza/posts/:postId/read
 */
router.put("/:postId/read", async (req, res) => {
  try {
    const post = await markPostAsRead(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Toggle the resolved status of a post
 * PUT /api/piazza/posts/:postId/resolved
 */
router.put("/:postId/resolved", async (req, res) => {
  try {
    const post = await toggleResolvedStatus(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Toggle the pinned status of a post
 * PUT /api/piazza/posts/:postId/pinned
 */
router.put("/:postId/pinned", async (req, res) => {
  try {
    const post = await togglePinnedStatus(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 