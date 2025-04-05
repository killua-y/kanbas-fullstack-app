import {
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  FormSelect,
  Row,
  Col,
} from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import { addAssignment, updateAssignment } from "./reducer";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as coursesClient from "../client";
import * as assignmentsClient from "./client";

export default function AssignmentEditor() {
  const { cid, aid } = useParams(); // Retrieve course ID and assignment ID
  const courseId = cid;
  const assignmentId = aid;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Find the assignment in the database
  const assignments = useSelector((state: any) => state.assignmentsReducer.assignments);

  const existingAssignment = assignments.find((a: { _id: string | undefined; }) => a._id === assignmentId);
  
  const [assignment, setAssignment] = useState(
    existingAssignment || {
      _id: new Date().getTime().toString(),
      title: "",
      description: "",
      points: 100,
      availableFrom: "",
      dueDate: "",
      course: courseId
    }
  );

  const handleSave = async () => {
    if (!assignment.title.trim()) {
      alert("Assignment title cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      if (existingAssignment) {
        // Update existing assignment
        await assignmentsClient.updateAssignment(assignment._id, assignment);
        dispatch(updateAssignment(assignment)); // Update in Redux
      } else {
        // Create new assignment
        const createdAssignment = await coursesClient.createAssignmentForCourse(
          courseId || "",
          assignment
        );
        dispatch(addAssignment(createdAssignment)); // Add to Redux
      }
      navigate(`/Kambaz/Courses/${courseId}/Assignments`);
    } catch (error) {
      console.error("Error saving assignment:", error);
      alert("There was an error saving the assignment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{existingAssignment ? "Edit" : "New"} Assignment</h2>
      
      {/* Assignment Name */}
      <FormGroup className="mb-4">
        <FormLabel>Assignment Name</FormLabel>
        <FormControl
          type="text"
          placeholder="Enter assignment name"
          value={assignment.title}
          onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
        />
      </FormGroup>

      {/* Description */}
      <FormGroup className="mb-4">
        <FormLabel>Description</FormLabel>
        <FormControl
          as="textarea"
          rows={6}
          value={assignment.description}
          onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
        />
      </FormGroup>

      {/* Points, Assignment Group, and Display Grade */}
      <Row className="mb-4">
        <Col md={4}>
          <FormGroup>
            <FormLabel>Points</FormLabel>
            <FormControl 
            type="number" 
            value={assignment.points}
            onChange={(e) => setAssignment({ ...assignment, points: parseInt(e.target.value) || 0 })}
             />
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <FormLabel>Assignment Group</FormLabel>
            <FormSelect defaultValue="assignments">
              <option value="assignments">ASSIGNMENTS</option>
              <option value="quiz">QUIZ</option>
            </FormSelect>
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <FormLabel>Display Grade as</FormLabel>
            <FormSelect defaultValue="percentage">
              <option value="percentage">Percentage</option>
              <option value="points">Points</option>
            </FormSelect>
          </FormGroup>
        </Col>
      </Row>

      {/* Submission Type and Online Entry Options */}
      <Row className="mb-4">
        <Col>
          <FormGroup>
            <FormLabel>Submission Type</FormLabel>
            <FormSelect defaultValue="online">
              <option value="online">Online</option>
              <option value="inperson">Inperson</option>
            </FormSelect>
          </FormGroup>

          <fieldset className="mt-3">
            <legend>Online Entry Options</legend>
            <Form.Check
              type="checkbox"
              id="text-entry"
              label="Text Entry"
              className="mb-2"
            />
            <Form.Check
              type="checkbox"
              id="website-url"
              label="Website URL"
              className="mb-2"
            />
            <Form.Check
              type="checkbox"
              id="media-recordings"
              label="Media Recordings"
              className="mb-2"
            />
            <Form.Check
              type="checkbox"
              id="student-annotation"
              label="Student Annotation"
              className="mb-2"
            />
            <Form.Check type="checkbox" id="file-uploads" label="File Uploads" />
          </fieldset>
        </Col>
      </Row>

      {/* Assign To, Due Date, and Availability */}
      <Row className="mb-4">
        <Col md={4}>
          <FormGroup>
            <FormLabel>Assign To</FormLabel>
            <FormControl type="text" defaultValue="Everyone" />
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <FormLabel>Due</FormLabel>
            <FormControl 
            type="datetime-local" 
            value={assignment.dueDate}
            onChange={(e) => setAssignment({...assignment, dueDate: e.target.value})}
             />
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <FormLabel>Available from</FormLabel>
            <FormControl
              type="datetime-local"
              value={assignment.availableFrom}
              onChange={(e) => setAssignment({...assignment, availableFrom: e.target.value})}
            />
          </FormGroup>
        </Col>
      </Row>

      {/* Buttons */}
      <div className="d-flex justify-content-end mt-4">
        <Link to={`/Kambaz/Courses/${courseId}/Assignments`} className="btn btn-light me-2">
          Cancel
        </Link>
        <button 
          className="btn btn-success" 
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>

    </div>
  );
}