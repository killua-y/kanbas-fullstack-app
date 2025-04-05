import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
    app.post("/api/enrollments/:courseId", (req, res) => {
        const currentUser = req.session["currentUser"];
        const { courseId } = req.params;
        dao.enrollUserInCourse(currentUser._id, courseId);
        res.json({ status: "success" });
    });

    app.delete("/api/enrollments/:courseId", (req, res) => {
        const currentUser = req.session["currentUser"];
        const { courseId } = req.params;
        const status = dao.unenrollUserFromCourse(currentUser._id, courseId);
        res.json(status ? { status: "success" } : { status: "error", message: "Enrollment not found" });
    });
}