import { useEffect } from 'react';
import './PostList.css';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setPosts } from './reducer';
import { useDispatch } from 'react-redux';
import * as postClient from './client';

interface PostListProps {
  onSelectPost: (post: any) => void;
  selectedPostId?: string;
  searchQuery?: string;
}

/**
 * Each post includes the following fields:
 * - `_id`: Unique identifier for the post (UUID)
 * - `postType`: Type of post (question or note)
 * - `postTo`: Who the post is visible to (course or individual)
 * - `title`: Title of the post
 * - `text`: Content of the post
 * - `postBy`: User who created the post
 * - `date`: When the post was created
 * - `course`: Course the post belongs to
 * - `folders`: Folders the post belongs to
 * - `individualRecipients`: Users who can see the post (if postTo is "individual")
 * - `viewedBy`: Array of user IDs who have viewed the post
 * - `isResolved`: Whether the post has been resolved
 * - `isPinned`: Whether the post is pinned
 * - `isRead`: Whether the post has been read
 */
interface Post {
  _id: string;
  postType: string;
  postTo: string;
  title: string;
  text: string;
  postBy: string;
  date: Date;
  course: string;
  folders: string[];
  individualRecipients: string[];
  viewedBy: string[];
  isResolved: boolean;
  isPinned: boolean;
  isRead: boolean;
}

export default function PostList({ onSelectPost, selectedPostId, searchQuery = '' }: PostListProps) {
  const { cid } = useParams(); // Get course ID from URL
  const { posts } = useSelector((state: any) => state.postsReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const dispatch = useDispatch();

  const fetchPostForCourse = async () => {
    const data = await postClient.findPostsForCourse(cid!);
    dispatch(setPosts(data));
  };

  useEffect(() => {
    fetchPostForCourse();
  }, [cid]);

  // Filter posts based on visibility settings and search query
  const filteredPosts = posts.filter((post: Post) => {
    // First check visibility settings
    let isVisible = false;
    if (post.postTo === "course") {
      isVisible = true;
    } else if (post.postTo === "individual") {
      isVisible = post.individualRecipients.includes(currentUser?._id);
    }

    // If not visible, return false
    if (!isVisible) {
      return false;
    }

    // If there's no search query, show all visible posts
    if (!searchQuery.trim()) {
      return true;
    }

    // Search in title and text
    const searchLower = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(searchLower) ||
      post.text.toLowerCase().includes(searchLower)
    );
  });

  const handlePostClick = async (post: Post) => {
    if (currentUser && currentUser._id) {
      try {
        // Use the viewPost function to add the current user to the viewedBy list
        const updatedPost = await postClient.viewPost(post._id, currentUser._id);
        
        // Mark the post as read
        const readPost = await postClient.markPostAsRead(post._id);
        
        // Update the post in the Redux store with the read status
        const updatedPosts = posts.map((p: Post) => 
          p._id === post._id ? { ...readPost, viewedBy: updatedPost.viewedBy } : p
        );
        dispatch(setPosts(updatedPosts));
        
        // Call the onSelectPost callback with the updated post
        onSelectPost({ ...readPost, viewedBy: updatedPost.viewedBy });
      } catch (error) {
        console.error("Error viewing post:", error);
        // If there's an error, still select the post
        onSelectPost(post);
      }
    } else {
      // If no current user, just select the post without updating view count
      onSelectPost(post);
    }
  };

  return (
    <div className="post-list">
      {filteredPosts.map((post: Post) => (
        <div
          key={post._id}
          className={`post-item ${post.isRead ? 'read' : 'unread'} ${post._id === selectedPostId ? 'selected' : ''}`}
          onClick={() => handlePostClick(post)}
        >
          <div className="post-icon">
            {post.postType === 'note' ? '📢' : '❓'}
          </div>
          
          <div className="post-content">
            <div className="post-header">
              <span className="post-title">{post.title}</span>
              <span className="post-date">{new Date(post.date).toLocaleString()}</span>
            </div>
            
            <div className="post-meta">
              <span className="post-author">{post.postBy}</span>
              {post.viewedBy && post.viewedBy.length > 0 && (
                <span className="post-responses">
                  {post.viewedBy.length} view{post.viewedBy.length !== 1 ? 's' : ''}
                </span>
              )}
              {post.individualRecipients && post.postTo === "individual" && (
                <span className="post-followups">
                  {post.individualRecipients.length} recipient{post.individualRecipients.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 