import { useState } from "react";
import { FormControl } from "react-bootstrap";
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
export default function WorkingWithObjects() {
    const [assignment, setAssignment] = useState({
        id: 1, title: "NodeJS Assignment",
        description: "Create a NodeJS server with ExpressJS",
        due: "2021-10-10", completed: false, score: 0,
    });
    const [module, setModule] = useState({
        id: 1,
        name: "Intro to React",
        description: "Introduction to React, how to use",
        course: "CS4550",
    });
    const ASSIGNMENT_API_URL = `${REMOTE_SERVER}/lab5/assignment`
    const MODULE_API_URL = `${REMOTE_SERVER}/lab5/module`;

    return (
        <div id="wd-working-with-objects">
            <h3>Working With Objects</h3>
            <h4>Modifying Properties</h4>
            <a id="wd-update-assignment-title"
                className="btn btn-primary float-end"
                href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}>
                Update Title
            </a>
            <FormControl className="w-75" id="wd-assignment-title"
                defaultValue={assignment.title} onChange={(e) =>
                    setAssignment({ ...assignment, title: e.target.value })} />
            <hr />

            {/* Edit Assignment Score */}
            <h4>Editing Assignment Score</h4>
            <FormControl
                type="number"
                defaultValue={assignment.score}
                onChange={(e) => setAssignment({ ...assignment, score: Number(e.target.value) })}
            />
            <a className="btn btn-primary"
                href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}>
                Update Score
            </a>
            <hr />

            {/* Edit Assignment Completion Status */}
            <h4>Editing Assignment Completion Status</h4>
            <label>
                <input
                    type="checkbox"
                    checked={assignment.completed}
                    onChange={(e) => setAssignment({ ...assignment, completed: e.target.checked })}
                />
                Completed
            </label>
            <a className="btn btn-primary"
                href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}>
                Update Completion Status
            </a>
            <hr />

            <h4>Retrieving Objects</h4>
            <a id="wd-retrieve-assignments" className="btn btn-primary"
                href={`${REMOTE_SERVER}/lab5/assignment`}>
                Get Assignment
            </a><hr />

            <h4>Retrieving Properties</h4>
            <a id="wd-retrieve-assignment-title" className="btn btn-primary"
                href={`${REMOTE_SERVER}/lab5/assignment/title`}>
                Get Title
            </a><hr />

            <h4>Retrieving Module</h4>
            <a id="wd-retrieve-module" className="btn btn-primary"
                href={`${REMOTE_SERVER}/lab5/module`}>
                Get Module
            </a><hr />

            <h4>Retrieving Module Name</h4>
            <a id="wd-retrieve-module" className="btn btn-primary"
                href={`${REMOTE_SERVER}/lab5/module/name`}>
                Get Module Name
            </a><hr />

            <h4>Editing Module Name</h4>
            <FormControl className="w-75"
                defaultValue={module.name}
                onChange={(e) => setModule({ ...module, name: e.target.value })}
            />
            <a className="btn btn-primary"
                href={`${MODULE_API_URL}/name/${module.name}`}>
                Update Module Name
            </a><hr />

            <h4>Editing Module Description</h4>
            <FormControl className="w-75"
                defaultValue={module.description}
                onChange={(e) => setModule({ ...module, description: e.target.value })}
            />
            <a className="btn btn-primary"
                href={`${MODULE_API_URL}/description/${module.description}`}>
                Update Module Description
            </a><hr />
        </div>
    );
}
