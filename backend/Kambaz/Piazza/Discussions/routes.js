import express from "express";
import { 
  createDiscussion, 
  findDiscussionById, 
  findDiscussionsForPost,
  updateDiscussion, 
  deleteDiscussion,
  toggleResolvedStatus 
} from "./dao.js";

const router = express.Router();

/**
 * Create a new discussion
 * POST /api/piazza/discussions
 */
router.post("/", async (req, res) => {
  try {
    const discussion = await createDiscussion(req.body);
    res.status(201).json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get a discussion by ID
 * GET /api/piazza/discussions/:discussionId
 */
router.get("/:discussionId", async (req, res) => {
  try {
    const discussion = await findDiscussionById(req.params.discussionId);
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }
    res.json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get all discussions for a post
 * GET /api/piazza/discussions/post/:postId
 */
router.get("/post/:postId", async (req, res) => {
  try {
    const discussions = await findDiscussionsForPost(req.params.postId);
    res.json(discussions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Update a discussion
 * PUT /api/piazza/discussions/:discussionId
 */
router.put("/:discussionId", async (req, res) => {
  try {
    const discussion = await updateDiscussion(req.params.discussionId, req.body);
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }
    res.json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Toggle the resolved status of a discussion
 * PUT /api/piazza/discussions/:discussionId/resolved
 */
router.put("/:discussionId/resolved", async (req, res) => {
  try {
    const discussion = await toggleResolvedStatus(req.params.discussionId);
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }
    res.json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Delete a discussion
 * DELETE /api/piazza/discussions/:discussionId
 */
router.delete("/:discussionId", async (req, res) => {
  try {
    const discussion = await deleteDiscussion(req.params.discussionId);
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }
    res.json({ message: "Discussion deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;