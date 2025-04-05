import ModuleEditor from "./ModuleEditor";
import { FaPlus } from "react-icons/fa6";
import { FaCheck, FaBan } from "react-icons/fa6";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function ModulesControls(
  { moduleName, setModuleName, addModule }:
  { moduleName: string; setModuleName: (title: string) => void; addModule: () => void; }) {
  
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Get the current user from Redux
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  return (
    <div id="wd-modules-controls" className="text-nowrap d-flex align-items-center">
      <button id="wd-collapse-all" className="btn btn-lg btn-secondary me-2">
        Collapse All
      </button>
      <button id="wd-view-progress" className="btn btn-lg btn-secondary me-2">
        View Progress
      </button>

      {/* Publish Dropdown */}
      <div className="dropdown me-2">
        <button id="wd-publish-all-btn" className="btn btn-lg btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
          <FaCheck className="me-2" /> Publish All
        </button>
        <ul className="dropdown-menu">
          <li><a id="wd-publish-all-modules-and-items-btn" className="dropdown-item" href="#"><FaCheck className="me-2 text-success" /> Publish all modules and items</a></li>
          <li><a id="wd-publish-modules-only-btn" className="dropdown-item" href="#"><FaCheck className="me-2 text-success" /> Publish modules only</a></li>
          <li><a id="wd-unpublish-all-modules-and-items" className="dropdown-item" href="#"><FaBan className="me-2 text-danger" /> Unpublish all modules and items</a></li>
          <li><a id="wd-unpublish-modules-only" className="dropdown-item" href="#"><FaBan className="me-2 text-danger" /> Unpublish modules only</a></li>
        </ul>
      </div>

      {/* Add Module Button - Only visible to FACULTY */}
      {currentUser?.role === "FACULTY" && (
        <>
          <Button variant="danger" onClick={handleShow} >
            <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
            Module
          </Button>
          <ModuleEditor show={show} handleClose={handleClose} dialogTitle="Add Module"
            moduleName={moduleName} setModuleName={setModuleName} addModule={addModule} />
        </>
      )}
    </div>
  );
}
