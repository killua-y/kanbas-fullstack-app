import { useSelector } from 'react-redux';
import { useState } from 'react';
import './styles.css';
import PostList from './Post/PostList';
import TopNavigation from './components/TopNavigation';
import ClassGlance from './components/ClassGlance';
import Editor from './Post/Editor';
import PostView from './Post/PostView';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addPost } from './Post/reducer';
import * as postClient from './Post/client';

export default function Piazza() {
  const { cid } = useParams(); // Get course ID from URL
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const dispatch = useDispatch();

  // Mock data for the editor - replace these with actual data in the future
  const mockUsers = [
    { id: '1', name: 'Jose Annunziato', role: 'instructor' as const },
    { id: '2', name: 'Student 1', role: 'student' as const },
    { id: '3', name: 'Student 2', role: 'student' as const },
  ];

  const mockFolders = ['hw1', 'hw2', 'hw3', 'hw4', 'hw5', 'hw6', 'project', 'exam', 'logistics', 'other', 'office_hours'];

  const handleNewPost = () => {
    setIsEditing(true);
    setSelectedPost(null);
  };

  const handleCancelPost = () => {
    setIsEditing(false);
  };

  const handleSubmitPost = async (postData: any) => {
    try {
      // Format the post data according to the backend schema
      const formattedPost = {
        postType: postData.type.toLowerCase(),
        postTo: postData.visibility === 'entire-class' ? 'course' : 'individual',
        title: postData.summary,
        text: postData.details,
        postBy: currentUser?._id || '1', // Use current user ID or fallback to mock ID
        course: cid,
        folders: postData.folders,
        individualRecipients: postData.visibility === 'individual' ? postData.visibleTo : [],
        viewCount: 0,
        isResolved: false,
        isPinned: false,
        isRead: false
      };

      // Create the post using the client
      const newPost = await postClient.createPost(formattedPost);
      
      // Update the Redux store with the new post
      dispatch(addPost(newPost));
      
      // Close the editor
      setIsEditing(false);
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

  return (
    <div className="piazza-container">
      <div className="piazza-header">
        <div className="course-info">
          <h1>Course {cid}</h1>
          <div className="header-links">
            <a href="#" className="active">Q & A</a>
            <a href="#">Resources</a>
            <a href="#">Statistics</a>
            <a href="#">Manage Class</a>
          </div>
        </div>
        <div className="user-controls">
          <span className="user-name">{currentUser?.username || "Jose Annunziato"}</span>
        </div>
      </div>
      
      <TopNavigation />
      
      <div className="piazza-main">
        <div className="content-wrapper">
          <div className="post-section">
            <div className="post-controls">
              <button className="new-post" onClick={handleNewPost}>New Post</button>
              <input type="search" placeholder="Search or add a post..." />
              <button className="show-actions">Show Actions</button>
            </div>
            <PostList onSelectPost={handleSelectPost} selectedPostId={selectedPost?._id} />
          </div>
          
          <div className="side-panel">
            {isEditing ? (
              <Editor
                onCancel={handleCancelPost}
                onSubmit={handleSubmitPost}
                users={mockUsers}
                folders={mockFolders}
              />
            ) : selectedPost ? (
              <PostView
                post={selectedPost}
                onClose={handleClosePostView}
              />
            ) : (
              <ClassGlance />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 