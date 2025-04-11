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
 * - `viewCount`: Number of times the post has been viewed
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
  viewCount: number;
  isResolved: boolean;
  isPinned: boolean;
  isRead: boolean;
}

export default function PostList({ onSelectPost, selectedPostId }: PostListProps) {
  const { cid } = useParams(); // Get course ID from URL
  const { posts } = useSelector((state: any) => state.postsReducer);
  const dispatch = useDispatch();

  const fetchPostForCourse = async () => {
    const data = await postClient.findPostsForCourse(cid!);
    dispatch(setPosts(data));
  };

  useEffect(() => {
    fetchPostForCourse();
  }, [cid]);

  return (
    <div className="post-list">
      {posts.map((post: Post) => (
        <div
          key={post._id}
          className={`post-item ${post.isRead ? 'read' : 'unread'} ${post._id === selectedPostId ? 'selected' : ''}`}
          onClick={() => onSelectPost(post)}
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
              {post.viewCount && (
                <span className="post-responses">
                  {post.viewCount} view{post.viewCount !== 1 ? 's' : ''}
                </span>
              )}
              {post.individualRecipients && (
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