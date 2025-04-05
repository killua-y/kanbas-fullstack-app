import { Link, useParams, useLocation } from "react-router-dom";

export default function CourseNavigation() {
  const params = useParams(); // Retrieve current course ID from URL
  const courseId = params.cid;
  const location = useLocation(); // Get current path

  const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];

  if (!courseId) {
    return <div>Error: Course ID not found!</div>; // Handle missing courseId
  }

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => {
        const path = `/Kambaz/Courses/${courseId}/${link}`;
        const isActive = location.pathname === path; // Check if the current link is active

        return (
          <Link
            key={link}
            to={path}
            id={`wd-course-${link.toLowerCase()}-link`}
            className={`list-group-item border border-0 ${isActive ? "active" : "text-danger"}`}
          >
            {link}
          </Link>
        );
      })}
    </div>
  );
}
