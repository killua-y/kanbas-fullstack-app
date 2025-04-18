import './TopNavigation.css';

interface FolderOption {
  _id: string;
  name: string;
  // Add count later if needed/available
}

// interface Category {
//   id: string;
//   name: string;
//   count: number;
//   isActive?: boolean;
// }

interface TopNavigationProps {
  isSidebarVisible: boolean;
  onToggleSidebar: () => void;
  folders: FolderOption[];             // Receive the list of folders
  selectedFolderId: string | null;     // Receive the ID of the selected folder (or null)
  onSelectFolder: (folderId: string | null) => void;
}

export default function TopNavigation({ isSidebarVisible, onToggleSidebar, folders = [], // Default to empty array
  selectedFolderId,
  onSelectFolder }: TopNavigationProps) {

  const filters = ['Unread', 'Updated', 'Unresolved', 'Following'];


  return (
    <div className="top-navigation">
      <div className="filter-row">
        <button className="toggle-sidebar" onClick={onToggleSidebar}>
          {isSidebarVisible ? '◀' : '▶'}
        </button>
        {filters.map(filter => (
          <button key={filter} className="filter-button">
            {filter}
          </button>
        ))}
        <select className="filter-dropdown">
          <option value="1">1</option>
        </select>
      </div>

      <div className="categories-row">
        {/* {categories.map(category => (
          <div 
            key={category.id} 
            className={`category-item ${category.isActive ? 'active' : ''}`}
          >
            <span className="category-name">{category.name}</span>
            {category.count > 0 && (
              <span className="category-count">{category.count}</span>
            )}
          </div>
        ))} */}
        <div
          key="all-posts"
          className={`category-item ${selectedFolderId === null ? 'active' : ''}`}
          onClick={() => onSelectFolder(null)} // Call handler with null
          style={{ cursor: 'pointer' }} // Add pointer cursor
        >
          <span className="category-name">All Posts</span>
          {/* Add count later if available */}
        </div>
        {folders.map(folder => (
          <div
            key={folder._id} // Use folder._id as key
            className={`category-item ${selectedFolderId === folder._id ? 'active' : ''}`} // Check against selectedFolderId
            onClick={() => onSelectFolder(folder._id)} // Call handler with folder._id
            style={{ cursor: 'pointer' }} // Add pointer cursor
          >
            <span className="category-name">{folder.name}</span>
            {/* Add count later if available */}
            {/* {folder.count > 0 && ( <span className="category-count">{folder.count}</span> )} */}
          </div>
        ))}
      </div>
    </div>
  );
} 