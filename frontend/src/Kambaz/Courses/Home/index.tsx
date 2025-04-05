import Modules from "../Modules";
import CourseStatus from "./Status";

export default function Home() {
  return (
    <div className="d-flex" id="wd-home">
      {/* Left Section: Modules */}
      <div className="flex-fill me-4"> {/* Added margin-end for spacing */}
        <Modules />
      </div>

      {/* Right Section: Course Status */}
      <div className="d-none d-md-block">
        <CourseStatus />
      </div>
    </div>
  );
}
