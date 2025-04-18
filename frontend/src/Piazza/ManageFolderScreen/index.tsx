import { useState, useEffect, useCallback } from 'react';
import * as folderClient from './client';
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
  onFoldersChanged?: () => void; // Callback function to notify parent component of changes
}

export default function ManageFolders({ courseId, userId, onFoldersChanged }: ManageFoldersProps) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const fetchFolders = useCallback(async () => {
    if (!courseId) return; // Don't fetch if courseId is not available

    try {
      // Use the client function to fetch folders for the specific course
      const fetchedFolders = await folderClient.findFoldersByCourse(courseId);
      setFolders(fetchedFolders);
    } catch (err: any) {
      console.error("Error fetching folders:", err);
      setFolders([]); // Clear folders on error
    }
  }, [courseId]); // Dependency: re-fetch if courseId changes

  // Initial fetch on component mount or when courseId changes
  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]); // fetchFolders is stable due to useCallback

  const handleAddFolder = async () => {
    if (!newFolderName.trim() || !courseId || !userId) {
      return;
    };

    try {
      const folderData = {
        name: newFolderName.trim(),
        course: courseId,
        author: userId,
      };
      // Use the client function to create the folder
      await folderClient.createFolder(folderData);
      setNewFolderName(''); // Clear input
      await fetchFolders(); // Re-fetch the list to show the new folder
      
      // Notify parent component that folders have changed
      if (onFoldersChanged) {
        onFoldersChanged();
      }
    } catch (err: any) {
      console.error("Error adding folder:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Use the client function to delete the folder
      await folderClient.deleteFolder(id);
      await fetchFolders(); // Re-fetch the list to reflect the deletion
      
      // Notify parent component that folders have changed
      if (onFoldersChanged) {
        onFoldersChanged();
      }
    } catch (err: any) {
      console.error("Error deleting folder:", err);
    }
  };

  const startEditing = (folder: Folder) => {
    setEditingId(folder._id);
    setEditName(folder.name);
  };

  const saveEdit = async () => {
    if (!editingId || !editName.trim() || !userId) {
      return;
    };

    try {
      const updateData = {
        name: editName.trim(),
        editBy: userId, // Record who edited the folder
      };
      // Use the client function to update the folder
      await folderClient.updateFolder(editingId, updateData);
      cancelEditing(); // Clear editing state
      await fetchFolders(); // Re-fetch the list to show the updated folder
      
      // Notify parent component that folders have changed
      if (onFoldersChanged) {
        onFoldersChanged();
      }
    } catch (err: any) {
      console.error("Error updating folder:", err);
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
  };

  return (
    <div className="mfs-container">
      <h2>Manage Folders </h2>

      <div className="add-folder" style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="New folder name"
          style={{ marginRight: '0.5rem' }}
        />
        <button className='folder-button' onClick={handleAddFolder}>
          Add Folder
        </button>
      </div>

      <ul className="folder-list" style={{ listStyle: 'none', padding: 0 }}>
        {folders.map(folder => (
          <li key={folder._id} style={{ marginBottom: '0.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
            {editingId === folder._id ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{ marginRight: '0.5rem' }}
                />
                <button className='folder-button' onClick={saveEdit} style={{ marginRight: '0.5rem' }}>
                  Save
                </button>
                <button className='folder-button' onClick={cancelEditing}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span style={{ marginRight: '1rem' }}>{folder.name}</span>
                <button className='folder-button' onClick={() => startEditing(folder)} style={{ marginRight: '0.5rem' }}>
                  Edit
                </button>
                <button className='folder-button' onClick={() => handleDelete(folder._id)}>
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