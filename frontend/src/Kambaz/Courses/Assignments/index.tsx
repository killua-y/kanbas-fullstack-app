import { BsGripVertical } from "react-icons/bs";
import { FaPlus, FaTrash } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import { MdCheckCircle } from "react-icons/md";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { deleteAssignment, setAssignment } from "./reducer"; 
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import * as coursesClient from "../client";
import * as assignmentsClient from "./client";

// 1) Define Assignment interface
interface Assignment {
  _id: string;
  title: string;
  description: string;
  availableFrom: string;
  dueDate: string;
  points: number; // or string if that's how your data is stored
  course: string;
}

export default function Assignments() {
  const { cid: courseId } = useParams(); // Get course ID from URL
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get current user from Redux store
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  // 2) Filter assignments by course, typed as Assignment[]
  const assignments: Assignment[] = useSelector((state: any) => state.assignmentsReducer.assignments)
    .filter((assignment: Assignment) => assignment.course === courseId);

  // 3) selectedAssignment typed as Assignment | null
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch assignments from the server when component mounts
  useEffect(() => {
    const fetchAssignments = async () => {
      setIsLoading(true);
      try {
        if (courseId) {
          const data = await coursesClient.findAssignmentsForCourse(courseId);
          dispatch(setAssignment(data));
        }
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAssignments();
  }, [courseId, dispatch]);

  // Show delete confirmation modal
  const handleShowDeleteModal = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowDeleteModal(true);
  };

  // Confirm delete action
  const handleConfirmDelete = async () => {
    if (selectedAssignment) {
      try {
        // Call the API to delete the assignment
        await assignmentsClient.deleteAssignment(selectedAssignment._id);
        // Update the Redux store
        dispatch(deleteAssignment(selectedAssignment._id));
      } catch (error) {
        console.error("Error deleting assignment:", error);
      }
    }
    setShowDeleteModal(false);
    setSelectedAssignment(null);
  };

  return (
    <div className="container mt-4">
      {/* Header and Search Bar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <BiSearch className="fs-4 text-secondary me-2" />
          <input
            type="text"
            placeholder="Search for Assignments"
            className="form-control"
            style={{ maxWidth: "300px" }}
          />
        </div>

        {/* Only FACULTY can add assignments */}
        {currentUser?.role === "FACULTY" && (
          <div className="d-flex ms-auto">
            <button
              className="btn btn-danger d-flex align-items-center"
              onClick={() => navigate(`/Kambaz/Courses/${courseId}/Assignments/New`)}
            >
              <FaPlus className="me-2" /> Assignment
            </button>
          </div>
        )}
      </div>

      {/* Assignments List */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center bg-light">
          <div className="d-flex align-items-center">
            <BsGripVertical className="me-2 fs-4" />
            <strong>ASSIGNMENTS</strong>
          </div>
        </div>

        <ul className="list-group list-group-flush">
          {isLoading ? (
            <li className="list-group-item text-center">Loading assignments...</li>
          ) : assignments.length > 0 ? (
            // 4) Map typed assignments
            assignments.map((assignment: Assignment) => (
              <li
                key={assignment._id}
                className="list-group-item d-flex align-items-center justify-content-between"
              >
                <div className="d-flex align-items-center flex-grow-1">
                  <div className="border-start border-success border-3 me-3"></div>
                  <div>
                    <Link
                      to={`/Kambaz/Courses/${courseId}/Assignments/${assignment._id}`}
                      className="fw-bold text-decoration-none text-dark"
                    >
                      {assignment.title}
                    </Link>
                    <div className="text-muted small">
                      {assignment.description} |{" "}
                      <span className="text-danger">
                        Not available until {assignment.availableFrom}
                      </span>{" "}
                      | Due {assignment.dueDate} | {assignment.points} pts
                    </div>
                  </div>
                </div>

                {/* Icons: Green checkmark and Delete button in the same row */}
                <div className="d-flex align-items-center">
                  <MdCheckCircle className="text-success fs-5 me-3" />
                  {/* Delete button - Only FACULTY can delete */}
                  {currentUser?.role === "FACULTY" && (
                    <FaTrash
                      className="text-danger"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleShowDeleteModal(assignment)}
                    />
                  )}
                </div>
              </li>
            ))
          ) : (
            <li className="list-group-item text-center text-muted">
              No assignments available for this course.
            </li>
          )}
        </ul>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>{selectedAssignment?.title}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}