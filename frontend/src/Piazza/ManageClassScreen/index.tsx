import MCSNavigation from "./components/MCSNavigation";
import "../styles.css";
import { Routes, Route } from "react-router-dom";
import ManageFolderScreen from "../ManageFolderScreen";

interface ManageClassScreenProps {
    courseId: string;
    userId: string;
    onFoldersChanged?: () => void;
}

export default function ManageClassScreen({ courseId, userId, onFoldersChanged }: ManageClassScreenProps) {
    return (
        <div className="piazza-main">
            <MCSNavigation />
            <Routes>
                <Route
                    path="manage-folders"
                    element={<ManageFolderScreen 
                        courseId={courseId} 
                        userId={userId} 
                        onFoldersChanged={onFoldersChanged}
                    />}
                />
            </Routes>
        </div>
    );
}