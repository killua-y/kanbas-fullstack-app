import './TopNavigation.css';

interface FolderOption {
  _id: string;
  name: string;
  // Add count later if needed/available
}

interface Category {
  id: string;
  name: string;
  count: number;
  isActive?: boolean;
}

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
  const categories: Category[] = [
    { id: 'live', name: 'LIVE Q&A', count: 0 },
    { id: 'drafts', name: 'Drafts', count: 0 },
    { id: 'hw1', name: 'hw1', count: 21, isActive: true },
    { id: 'hw2', name: 'hw2', count: 21 },
    { id: 'hw3', name: 'hw3', count: 4 },
    { id: 'hw4', name: 'hw4', count: 4 },
    { id: 'hw5', name: 'hw5', count: 14 },
    { id: 'hw6', name: 'hw6', count: 7 },
    { id: 'project', name: 'project', count: 12 },
    { id: 'exam', name: 'exam', count: 2 },
    { id: 'logistics', name: 'logistics', count: 10 },
    { id: 'other', name: 'other', count: 5 },
    { id: 'office_hours', name: 'office_hours', count: 11 }
  ];

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