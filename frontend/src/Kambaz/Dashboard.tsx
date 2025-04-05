import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Row, Col, Card, FormControl } from "react-bootstrap";

export default function Dashboard(
  { courses, course, setCourse, addNewCourse,
    deleteCourse, updateCourse, allCourses, enroll, unenroll}: {
    courses: any[]; course: any; setCourse: (course: any) => void;
    addNewCourse: () => void; deleteCourse: (course: any) => void;
    updateCourse: () => void; allCourses: any[]; 
    enroll: (course: any) => void;
    unenroll: (course: any) => void; })
  {
  // Current user from Redux
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  // Toggle between showing all courses vs. enrolled courses (for students)
  const [showAllCourses, setShowAllCourses] = useState(false);

  // Helper: Check enrollment
  const isEnrolled = (courseId: string) =>
    courses.some((course: any) => course._id === courseId);

  // Student can toggle showing all courses or just enrolled courses
  const toggleShowAllCourses = () => {
    setShowAllCourses(!showAllCourses);
  };

  // Get the correct courses to display based on toggle
  const displayCourses = showAllCourses && currentUser?.role === "STUDENT" 
    ? allCourses 
    : courses;
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />

      {/* FACULTY: Add / Edit / Update */}
      {currentUser?.role === "FACULTY" && (
        <>
          <h5>
            New Course
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={addNewCourse}
            >
              Add
            </button>
            <button
              className="btn btn-warning float-end me-2"
              onClick={updateCourse}
              id="wd-update-course-click"
            >
              Update
            </button>
          </h5>
          <br />
          <FormControl
            value={course.name}
            className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <FormControl
            value={course.description}
            onChange={(e) => setCourse({ ...course, description: e.target.value })}
          />
          <hr />
        </>
      )}

      {/* STUDENT: Enrollments Button */}
      {currentUser?.role === "STUDENT" && (
        <button
          className="btn btn-primary float-end mb-3"
          onClick={toggleShowAllCourses}
        >
          {showAllCourses ? "Show Enrolled Courses" : "Show All Courses"}
        </button>
      )}

      <h2 id="wd-dashboard-published">
        Published Courses ({displayCourses?.length || 0})
      </h2>
      <hr />

      <Row xs={1} md={5} className="g-4" id="wd-dashboard-courses">
        {displayCourses
          .map((course) => (
            <Col
              key={course._id}
              className="wd-dashboard-course"
              style={{ width: "300px" }}
            >
              <Card>
                <Card.Img
                  src={course.image}
                  variant="top"
                  width="100%"
                  height={160}
                />
                <Card.Body className="card-body">
                  <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    {course.name}
                  </Card.Title>
                  <Card.Text
                    className="wd-dashboard-course-description overflow-hidden"
                    style={{ height: "100px" }}
                  >
                    {course.description}
                  </Card.Text>

                  {/* 
                    The 'Go' button: 
                    - Visible for faculty OR for students already enrolled.
                    - If user is not enrolled, they can't navigate to the course. 
                  */}
                  {(currentUser?.role === "FACULTY" || isEnrolled(course._id)) && (
                    <Link
                      to={`/Kambaz/Courses/${course._id}/Home`}
                      className="btn btn-primary me-2"
                    >
                      Go
                    </Link>
                  )}

                  {/* STUDENT: Enroll / Unenroll */}
                  {currentUser?.role === "STUDENT" && (
                    <>
                      {isEnrolled(course._id) ? (
                        <button
                          className="btn btn-danger"
                          onClick={(e) => {
                            e.preventDefault();
                            unenroll(course._id);
                          }}
                        >
                          Unenroll
                        </button>
                      ) : (
                        <button
                          className="btn btn-success"
                          onClick={(e) => {
                            e.preventDefault();
                            enroll(course._id);
                          }}
                        >
                          Enroll
                        </button>
                      )}
                    </>
                  )}

                  {/* FACULTY: Delete / Edit */}
                  {currentUser?.role === "FACULTY" && (
                    <>
                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          deleteCourse(course._id);
                        }}
                        className="btn btn-danger float-end"
                        id="wd-delete-course-click"
                      >
                        Delete
                      </button>
                      <button
                        id="wd-edit-course-click"
                        onClick={(event) => {
                          event.preventDefault();
                          setCourse(course);
                        }}
                        className="btn btn-warning me-2 float-end"
                      >
                        Edit
                      </button>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
    </div>
  );
}