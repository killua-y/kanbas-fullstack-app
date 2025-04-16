import { useState, useEffect, useCallback } from 'react';
// Adjust the import path to where your client file is located
import * as folderClient from './client'; // Assuming client is in services folder
import "./ManageFolderScreen.css"

// Interface matching the expected API response (adjust if needed)
interface Folder {
  _id: string; // Use _id from MongoDB
  name: string;
  author: string;
  course: string;
  // Add other fields returned by the API if needed (e.g., editBy, createdAt)
}

// Props required by the component
interface ManageFoldersProps {
  courseId: string; // ID of the current course
  userId: string;   // ID of the logged-in user
}

export default function ManageFolders({ courseId, userId }: ManageFoldersProps) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching ---
  const fetchFolders = useCallback(async () => {
    if (!courseId) return; // Don't fetch if courseId is not available

    setIsLoading(true);
    setError(null);
    try {
      // Use the client function to fetch folders for the specific course
      const fetchedFolders = await folderClient.findFoldersByCourse(courseId);
      setFolders(fetchedFolders);
    } catch (err: any) {
      console.error("Error fetching folders:", err);
      setError(err.response?.data?.message || "Failed to fetch folders.");
      setFolders([]); // Clear folders on error
    } finally {
      setIsLoading(false);
    }
  }, [courseId]); // Dependency: re-fetch if courseId changes

  // Initial fetch on component mount or when courseId changes
  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]); // fetchFolders is stable due to useCallback

  // --- Event Handlers ---
  const handleAddFolder = async () => {
    if (!newFolderName.trim() || !courseId || !userId) {
        setError("Folder name, course ID, and user ID are required.");
        return;
    };

    setIsLoading(true);
    setError(null);
    try {
      const folderData = {
        name: newFolderName.trim(),
        course: courseId,
        author: userId,
        // Add post ID here if required by your backend for folder creation:
        // post: somePostId,
      };
      // Use the client function to create the folder
      await folderClient.createFolder(folderData);
      setNewFolderName(''); // Clear input
      await fetchFolders(); // Re-fetch the list to show the new folder
    } catch (err: any) {
      console.error("Error adding folder:", err);
      setError(err.response?.data?.message || "Failed to add folder.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Optional: Add a confirmation dialog here
    // if (!window.confirm("Are you sure you want to delete this folder?")) {
    //   return;
    // }

    setIsLoading(true);
    setError(null);
    try {
      // Use the client function to delete the folder
      await folderClient.deleteFolder(id);
      await fetchFolders(); // Re-fetch the list to reflect the deletion
    } catch (err: any) {
      console.error("Error deleting folder:", err);
      setError(err.response?.data?.message || "Failed to delete folder.");
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (folder: Folder) => {
    setEditingId(folder._id); // Use _id
    setEditName(folder.name);
  };

  const saveEdit = async () => {
    if (!editingId || !editName.trim() || !userId) {
        setError("Folder ID, new name, and user ID are required for update.");
        return;
    };

    setIsLoading(true);
    setError(null);
    try {
      const updateData = {
        name: editName.trim(),
        editBy: userId, // Record who edited the folder
      };
      // Use the client function to update the folder
      await folderClient.updateFolder(editingId, updateData);
      cancelEditing(); // Clear editing state
      await fetchFolders(); // Re-fetch the list to show the updated folder
    } catch (err: any) {
      console.error("Error updating folder:", err);
      setError(err.response?.data?.message || "Failed to update folder.");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
  };

  // --- Rendering ---
  return (
    <div className="mfs-container"> {/* Consider adding some basic CSS */}
      <h2>Manage Folders {isLoading && <span className="loading-indicator">(Loading...)</span>}</h2>

      {error && <div className="error-message" style={{ color: 'red' }}>Error: {error}</div>}

      <div className="add-folder" style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="New folder name"
          disabled={isLoading}
          style={{ marginRight: '0.5rem' }}
        />
        <button onClick={handleAddFolder} disabled={isLoading || !newFolderName.trim()}>
          {isLoading ? 'Adding...' : 'Add Folder'}
        </button>
      </div>

      <ul className="folder-list" style={{ listStyle: 'none', padding: 0 }}>
        {folders.length === 0 && !isLoading && <li>No folders found for this course.</li>}
        {folders.map(folder => (
          <li key={folder._id} style={{ marginBottom: '0.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
            {editingId === folder._id ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  disabled={isLoading}
                  style={{ marginRight: '0.5rem' }}
                />
                <button onClick={saveEdit} disabled={isLoading || !editName.trim()} style={{ marginRight: '0.5rem' }}>
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
                <button onClick={cancelEditing} disabled={isLoading}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span style={{ marginRight: '1rem' }}>{folder.name}</span>
                <button onClick={() => startEditing(folder)} disabled={isLoading} style={{ marginRight: '0.5rem' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(folder._id)} disabled={isLoading}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}