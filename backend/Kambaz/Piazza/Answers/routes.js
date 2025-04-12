import express from "express";
import { 
  createAnswer, 
  findAnswerById, 
  findAnswersForPost, 
  updateAnswer, 
  deleteAnswer 
} from "./dao.js";

const router = express.Router();

/**
 * Create a new answer
 * POST /api/piazza/answers
 */
router.post("/", async (req, res) => {
  try {
    const answer = await createAnswer(req.body);
    res.status(201).json(answer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get an answer by ID
 * GET /api/piazza/answers/:answerId
 */
router.get("/:answerId", async (req, res) => {
  try {
    const answer = await findAnswerById(req.params.answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }
    res.json(answer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get all answers for a post
 * GET /api/piazza/answers/post/:postId
 */
router.get("/post/:postId", async (req, res) => {
  try {
    const answers = await findAnswersForPost(req.params.postId);
    res.json(answers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Update an answer
 * PUT /api/piazza/answers/:answerId
 */
router.put("/:answerId", async (req, res) => {
  try {
    const answer = await updateAnswer(req.params.answerId, req.body);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }
    res.json(answer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Delete an answer
 * DELETE /api/piazza/answers/:answerId
 */
router.delete("/:answerId", async (req, res) => {
  try {
    const answer = await deleteAnswer(req.params.answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }
    res.json({ message: "Answer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;