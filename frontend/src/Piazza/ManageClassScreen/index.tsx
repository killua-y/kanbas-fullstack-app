// src/Piazza/ManageClassScreen.tsx (or wherever it's defined)
import React from 'react'; // Import React for JSX
import MCSNavigation from "./components/MCSNavigation";
import "../styles.css"; // Adjust path if necessary
import { Routes, Route } from "react-router-dom"; // Removed useParams
import ManageFolderScreen from "../ManageFolderScreen"; // Adjust path if necessary

// 1. Define the props interface
interface ManageClassScreenProps {
    courseId: string; // Expecting string now, parent handles undefined case
    userId: string;   // Expecting string now, parent handles undefined case
}

// 2. Accept props in the function signature
export default function ManageClassScreen({ courseId, userId }: ManageClassScreenProps) {

    // 3. Remove internal fetching of courseId and userId
    // const { courseId } = useParams<{ courseId: string }>(); // DELETE this line
    // const { currentUser } = useAuth(); // DELETE this line (or equivalent Redux selector)
    // const userId = currentUser?._id; // DELETE this line

    // Optional: Add a check in case props somehow arrive undefined (belt and suspenders)
    if (!courseId || !userId) {
        return <div>Error: Missing required course or user information for management.</div>;
    }

    return (
        <div className="piazza-container"> {/* Maybe use a different class name if needed */}
            {/* Pass courseId down to navigation if needed */}
            <MCSNavigation />
            <div className="piazza-main"> {/* Maybe use a different class name */}
                <Routes>
                    <Route path="general-settings" element={<div>General Settings for Course {courseId}</div>} />
                    {/* 4. Pass the received props down to ManageFolderScreen */}
                    <Route
                        path="manage-folders"
                        element={<ManageFolderScreen courseId={courseId} userId={userId} />}
                    />
                    {/* Add other management routes here, passing props as needed */}
                    {/* Example: <Route path="manage-users" element={<ManageUsersScreen courseId={courseId} currentUserId={userId} />} /> */}
                </Routes>
            </div>
        </div>
    );
}