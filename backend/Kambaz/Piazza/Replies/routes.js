import express from "express";
import { 
  createReply, 
  findReplyById, 
  findRepliesForDiscussion,
  updateReply, 
  deleteReply 
} from "./dao.js";

const router = express.Router();

/**
 * Create a new reply
 * POST /api/piazza/replies
 */
router.post("/", async (req, res) => {
  try {
    const reply = await createReply(req.body);
    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get a reply by ID
 * GET /api/piazza/replies/:replyId
 */
router.get("/:replyId", async (req, res) => {
  try {
    const reply = await findReplyById(req.params.replyId);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }
    res.json(reply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get all replies for a discussion
 * GET /api/piazza/replies/discussion/:discussionId
 */
router.get("/discussion/:discussionId", async (req, res) => {
  try {
    const replies = await findRepliesForDiscussion(req.params.discussionId);
    res.json(replies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Update a reply
 * PUT /api/piazza/replies/:replyId
 */
router.put("/:replyId", async (req, res) => {
  try {
    const reply = await updateReply(req.params.replyId, req.body);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }
    res.json(reply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Delete a reply
 * DELETE /api/piazza/replies/:replyId
 */
router.delete("/:replyId", async (req, res) => {
  try {
    const reply = await deleteReply(req.params.replyId);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }
    res.json({ message: "Reply deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;