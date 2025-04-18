import { useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';
import './styles.css';
import PostList from './Post/PostList';
import TopNavigation from './components/TopNavigation';
import ClassGlance from './components/ClassGlance';
import Editor from './Post/Editor';
import PostView from './Post/PostView';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addPost } from './Post/reducer';
import * as postClient from './Post/client';
import * as courseClient from '../Kambaz/Courses/client';
import * as folderClient from '../Piazza/ManageFolderScreen/client'
import { Navigate } from 'react-router';
import ManageClassScreen from './ManageClassScreen';

interface FolderOption {
  _id: string;
  name: string;
}

export default function Piazza() {
  const { cid } = useParams(); // Get course ID from URL
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [courseUsers, setCourseUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [courseFolders, setCourseFolders] = useState<FolderOption[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const fetchData = async () => {
      if (cid) {
        // Fetch Users
        try {
          const users = await courseClient.findUsersForCourse(cid);
          if (isMounted) {
            const sortedUsers = users.sort((a: any, b: any) => {
              if (a.role === 'FACULTY' && b.role !== 'FACULTY') return -1;
              if (a.role !== 'FACULTY' && b.role === 'FACULTY') return 1;
              return 0;
            });
            setCourseUsers(sortedUsers);
          }
        } catch (error) {
          console.error("Error fetching course users:", error);
          // Handle user fetch error if needed
        }

        // Fetch Folders
        try {
          const folders = await folderClient.findFoldersByCourse(cid);
          if (isMounted) {
            // Assuming folders have _id and name properties from the API
            setCourseFolders(folders.map((f: { _id: any; name: any; }) => ({ _id: f._id, name: f.name })));
          }
        } catch (error: any) {
          console.error("Error fetching course folders:", error);
          if (isMounted) {
            console.log(error.response?.data?.message || "Failed to load folders.");
            setCourseFolders([]); // Clear folders on error
          }
        }
      } else {
        // Clear data if cid is not present
        if (isMounted) {
          setCourseUsers([]);
          setCourseFolders([]);
        }
      }
      
      if (isMounted) {
        setIsLoading(false);
      }
    };

    fetchData();

    // Cleanup function to prevent setting state on unmounted component
    return () => {
      isMounted = false;
    };
  }, [cid]);

  // console.log(courseFolders)
  // Format users for the Editor component
  const formattedUsers = courseUsers.map(user => ({
    id: user._id,
    name: `${user.firstName} ${user.lastName}`,
    role: user.role
  }));

  const handleNewPost = () => {
    setIsEditing(true);
    setSelectedPost(null);
  };

  const handleCancelPost = () => {
    setIsEditing(false);
  };

  const handleSubmitPost = async (postData: any) => {
    try {
      const selectedFolderNames = postData.folders; // Assuming this is an array of names from Editor
      console.log(postData)
      // Find the corresponding IDs from the full courseFolders list
      const selectedFolderIds = courseFolders
        .filter(folder => selectedFolderNames.includes(folder.name)) // Filter by selected names
        .map(folder => folder._id);
      // Format the post data according to the backend schema
      const formattedPost = {
        postType: postData.type.toLowerCase(),
        postTo: postData.visibility === 'entire-class' ? 'course' : 'individual',
        title: postData.summary,
        text: postData.details,
        postBy: currentUser?._id || '0', // Use current user ID or fallback to mock ID
        course: cid,
        folders: selectedFolderIds,
        individualRecipients: postData.visibility === 'individual' ? postData.visibleTo : [],
        viewedBy: [],
        isResolved: false,
        isPinned: false,
        isRead: false,
        date: new Date().toISOString() // Add current date
      };

      // Create the post using the client
      const newPost = await postClient.createPost(formattedPost);

      // Update the Redux store with the new post
      dispatch(addPost(newPost));

      // Close the editor and select the new post
      setIsEditing(false);
      setSelectedPost(newPost);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  const handleSelectPost = (post: any) => {
    setSelectedPost(post);
    setIsEditing(false);
  };

  const handleClosePostView = () => {
    setSelectedPost(null);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      // The search is already live, no need for additional action
      event.preventDefault();
    }
  };

  const handleToggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleSelectFolder = (folderId: string | null) => {
    setSelectedFolderId(folderId);
  };

  // Function to refresh folders
  const refreshFolders = useCallback(async () => {
    if (!cid) return;
    
    try {
      const folders = await folderClient.findFoldersByCourse(cid);
      setCourseFolders(folders.map((f: { _id: any; name: any; }) => ({ _id: f._id, name: f.name })));
    } catch (error: any) {
      console.error("Error refreshing folders:", error);
      console.log(error.response?.data?.message || "Failed to refresh folders.");
    }
  }, [cid]);

  return (
    <div className="piazza-container">
      <div className="piazza-header">
        <div className="course-info">
          <h1>Course {cid}</h1>
          <div className="header-links">
            <Link to={`/Kambaz/Courses/${cid}/Piazza`}
              className={location.pathname.endsWith('/Piazza') ? 'active' : ''}>
              Q & A
            </Link>
            <a href="#">Resources</a>
            <a href="#">Statistics</a>
            {/* <Link to={`/Kambaz/Courses/${cid}/Piazza/manage`}
              className={}>
              Manage Class
            </Link> */}
            {currentUser?.role === 'FACULTY' && (
              <Link
                to={`/Kambaz/Courses/${cid}/Piazza/manage`}
                className={location.pathname.includes('/manage') ? 'active' : ''}
              >
                Manage Class
              </Link>
            )}
          </div>
        </div>
        <div className="user-controls">
          <span className="user-name">{currentUser?.username || "Jose Annunziato"}</span>
        </div>
      </div>
      <Routes>
        <Route path="/" element={
          <>
            <TopNavigation
              isSidebarVisible={isSidebarVisible}
              onToggleSidebar={handleToggleSidebar}
              folders={courseFolders} // Pass fetched folders
              selectedFolderId={selectedFolderId} // Pass selected ID
              onSelectFolder={handleSelectFolder}
            />

            <div className="piazza-main">
              <div className="content-wrapper">
                {isLoading ? (
                  <div className="loading-indicator">Loading folders...</div>
                ) : (
                  <>
                    <div className={`post-section ${!isSidebarVisible ? 'hidden' : ''}`}>
                      <div className="post-controls">
                        <button className="new-post" onClick={handleNewPost}>New Post</button>
                        <input
                          type="search"
                          placeholder="Search or add a post..."
                          value={searchQuery}
                          onChange={handleSearch}
                          onKeyPress={handleSearchKeyPress}
                        />
                        <button className="show-actions">Show Actions</button>
                      </div>
                      <PostList
                        onSelectPost={handleSelectPost}
                        selectedPostId={selectedPost?._id}
                        searchQuery={searchQuery}
                        selectedFolderId={selectedFolderId} // Pass selected folder ID
                      />
                    </div>

                    <div className={`side-panel ${!isSidebarVisible ? 'expanded' : ''}`}>
                      {isEditing ? (
                        <Editor
                          onCancel={handleCancelPost}
                          onSubmit={handleSubmitPost}
                          users={formattedUsers}
                          folders={courseFolders.map(folder => folder.name)}
                        />
                      ) : selectedPost ? (
                        <PostView
                          post={selectedPost}
                          onClose={handleClosePostView}
                        />
                      ) : (
                        <ClassGlance courseId={cid} />
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        } />
        <Route path="manage/*" element={cid && currentUser._id ? (
          <ManageClassScreen 
            courseId={cid} 
            userId={currentUser._id} 
            onFoldersChanged={refreshFolders}
          />
        ) : (
          // Optional: Render a loading state, redirect, or null while waiting for data
          // For example, redirect to the main Piazza page or a login page
          // <Navigate to={`/Kambaz/Courses/${cid}/Piazza`} replace />
          <div>Loading management data or user not logged in...</div> // Or null
        )} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
} 