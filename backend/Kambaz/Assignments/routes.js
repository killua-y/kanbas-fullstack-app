import * as assignmentsDao from "./dao.js";

export default function AssignmentRoutes(app) {
  // Delete an assignment by ID
  app.delete("/api/assignments/:assignmentId", async (req, res) => {
    const { assignmentId } = req.params;
    const deleted = await assignmentsDao.deleteAssignment(assignmentId);
    res.json(deleted);
  });

  // Update an assignment by ID
  app.put("/api/assignments/:assignmentId", async (req, res) => {
    const { assignmentId } = req.params;
    const updatedAssignment = await assignmentsDao.updateAssignment(assignmentId, req.body);
    res.json(updatedAssignment);
  });

  // Find an assignment by ID
  app.get("/api/assignments/:assignmentId", async (req, res) => {
    const { assignmentId } = req.params;
    const assignment = await assignmentsDao.findAssignmentById(assignmentId);
    res.json(assignment);
  });
}
