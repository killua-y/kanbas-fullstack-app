import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
    app.post("/api/enrollments", dao.enrollUserInCourse);
}