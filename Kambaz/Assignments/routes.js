import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {

  // 4) Update an assignment by ID
  app.put("/api/assignments/:assignmentId", (req, res) => {
    const { assignmentId } = req.params;
    const updatedAssignment = dao.updateAssignment(assignmentId, req.body);
    res.json(updatedAssignment);
  });

  // 5) Delete an assignment by ID
  app.delete("/api/assignments/:assignmentId", (req, res) => {
    const { assignmentId } = req.params;
    const deleted = dao.deleteAssignment(assignmentId);
    res.json(deleted);
  });
}
