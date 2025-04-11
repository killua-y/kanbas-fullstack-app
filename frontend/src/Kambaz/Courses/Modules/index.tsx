import { useState, useEffect } from "react";
import { BsGripVertical } from "react-icons/bs";
import ModulesControls from "./ModulesControls";
import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";
import { useParams } from "react-router";
import { ListGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { setModules, addModule, editModule, updateModule, deleteModule } from "./reducer";
import * as courseClient from "../client";
import * as modulesClient from "./client";

export default function Modules() {
  const { cid } = useParams(); // Get course ID from URL
  const [moduleName, setModuleName] = useState("");
  const { modules } = useSelector((state: any) => state.modulesReducer);
  const dispatch = useDispatch();

  const fetchModulesForCourse = async () => {
    const modules = await courseClient.findModulesForCourse(cid!);
    dispatch(setModules(modules));
  };

  useEffect(() => {
    fetchModulesForCourse();
  }, [cid]);

  const addModuleHandler = async () => {
    const newModule = await courseClient.createModuleForCourse(cid!, {
      name: moduleName,
      course: cid,
    });
    dispatch(addModule(newModule));
    setModuleName("");
  };

  const deleteModuleHandler = async (moduleId: string) => {
    await modulesClient.deleteModule(moduleId);
    dispatch(deleteModule(moduleId));
  };

  const updateModuleHandler = async (module: any) => {
    await modulesClient.updateModule(module);
    dispatch(updateModule(module));
  };

  return (
    <div className="wd-modules">
      {/* Modules Controls */}
      <ModulesControls
        addModule={addModuleHandler}
        moduleName={moduleName}
        setModuleName={setModuleName}
      />

      {/* Modules List */}
      <ListGroup id="wd-modules" className="rounded-0">
        {modules
          // .filter((module: any) => module.course === cid)
          .map((module: any) => (
            <ListGroup.Item key={module._id} className="wd-module list-group-item p-0 mb-5 fs-5 border-gray">
              <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">

                {/* Check if module is in editing mode */}
                {!module.editing && module.name}
                {module.editing && (
                  <input onChange={(e) =>
                    updateModuleHandler({ ...module, name: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        updateModuleHandler({ ...module, editing: false });
                      }
                    }}
                    value={module.name} />
                )}

                {/* Pass delete and edit functions to ModuleControlButtons */}
                <ModuleControlButtons
                  moduleId={module._id}
                  deleteModule={(moduleId) => deleteModuleHandler(moduleId)}
                  editModule={() => dispatch(editModule(module._id))}
                />
              </div>

              {/* Render lessons inside each module */}
              {module.lessons && (
                <ul className="wd-lessons list-group rounded-0">
                  {module.lessons.map((lesson: any) => (
                    <li key={lesson._id} className="wd-lesson list-group-item p-3 ps-1">
                      <BsGripVertical className="me-2 fs-3" /> {lesson.name}
                      <LessonControlButtons />
                    </li>
                  ))}
                </ul>
              )}
            </ListGroup.Item>
          ))}
      </ListGroup>
    </div>
  );
}
