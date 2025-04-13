import { useEffect, useState } from 'react';
import './PostList.css';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setPosts } from './reducer';
import { useDispatch } from 'react-redux';
import * as postClient from './client';
import * as userClient from '../../Kambaz/Account/client';

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
  date: string | Date;
  course: string;
  folders: string[];
  individualRecipients: string[];
  viewedBy: string[];
  isResolved: boolean;
  isPinned: boolean;
  isRead: boolean;
}

interface User {
  _id: string;
  username: string;
  role: string;
}

interface PostGroup {
  title: string;
  posts: Post[];
  isCollapsed: boolean;
}

export default function PostList({ onSelectPost, selectedPostId, searchQuery = '' }: PostListProps) {
  const { cid } = useParams();
  const { posts } = useSelector((state: any) => state.postsReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const dispatch = useDispatch();
  const [postGroups, setPostGroups] = useState<PostGroup[]>([]);
  const [userMap, setUserMap] = useState<Record<string, User>>({});
  const [collapsedState, setCollapsedState] = useState<Record<string, boolean>>({});

  const fetchPostForCourse = async () => {
    const data = await postClient.findPostsForCourse(cid!);
    dispatch(setPosts(data));
  };

  useEffect(() => {
    fetchPostForCourse();
  }, [cid]);

  // Fetch user data for all posts
  useEffect(() => {
    const fetchUserData = async () => {
      if (!posts || posts.length === 0) return;
      
      // Get unique user IDs from posts
      const userIds = [...new Set(posts.map((post: Post) => post.postBy))];
      
      // Fetch user data for each ID
      const userData: Record<string, User> = {};
      
      for (const userId of userIds) {
        try {
          const user = await userClient.findUserById(userId as string);
          userData[userId as string] = user;
        } catch (error) {
          console.error(`Error fetching user data for ${userId}:`, error);
          // Add a placeholder user
          userData[userId as string] = { _id: userId as string, username: 'Unknown User', role: 'UNKNOWN' };
        }
      }
      
      setUserMap(userData);
    };
    
    fetchUserData();
  }, [posts]);

  // Filter posts based on visibility and search query
  const getFilteredPosts = () => {
    // First sort posts by date, newest first
    const sortedPosts = [...posts].sort((a: Post, b: Post) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    return sortedPosts.filter((post: Post) => {
      let isVisible = false;
      if (post.postTo === "course") {
        isVisible = true;
      } else if (post.postTo === "individual") {
        isVisible = post.individualRecipients.includes(currentUser?._id);
      }

      if (!isVisible) return false;

      if (!searchQuery.trim()) return true;

      const searchLower = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(searchLower) ||
        post.text.toLowerCase().includes(searchLower)
      );
    });
  };

  // Group posts by date categories
  useEffect(() => {
    const filteredPosts = getFilteredPosts();
    const groups: PostGroup[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Helper to get week range string
    const getWeekRange = (date: Date) => {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `WEEK ${startOfWeek.getMonth() + 1}/${startOfWeek.getDate()} - ${endOfWeek.getMonth() + 1}/${endOfWeek.getDate()}`;
    };

    // Group for TODAY
    const todayPosts = filteredPosts.filter((post: Post) => {
      const postDate = new Date(post.date);
      return postDate.toDateString() === today.toDateString();
    });
    if (todayPosts.length > 0) {
      const title = 'TODAY';
      groups.push({ 
        title, 
        posts: todayPosts, 
        isCollapsed: collapsedState[title] ?? false
      });
    }

    // Group for LAST WEEK
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    const lastWeekPosts = filteredPosts.filter((post: Post) => {
      const postDate = new Date(post.date);
      return postDate >= lastWeek && postDate < today;
    });
    if (lastWeekPosts.length > 0) {
      const title = 'LAST WEEK';
      groups.push({ 
        title, 
        posts: lastWeekPosts, 
        isCollapsed: collapsedState[title] ?? true
      });
    }

    // Group remaining posts by weeks
    const olderPosts = filteredPosts.filter((post: Post) => {
      const postDate = new Date(post.date);
      return postDate < lastWeek;
    });

    // Group by weeks
    const weekGroups: Record<string, Post[]> = {};
    olderPosts.forEach((post: Post) => {
      const postDate = new Date(post.date);
      const weekKey = getWeekRange(postDate);
      if (!weekGroups[weekKey]) {
        weekGroups[weekKey] = [];
      }
      weekGroups[weekKey].push(post);
    });

    // Add week groups
    Object.entries(weekGroups)
      .sort((a, b) => {
        // Sort week groups by the first post's date in each group
        const dateA = new Date(a[1][0].date);
        const dateB = new Date(b[1][0].date);
        return dateB.getTime() - dateA.getTime();
      })
      .forEach(([weekKey, weekPosts]) => {
        groups.push({ 
          title: weekKey, 
          posts: weekPosts, 
          isCollapsed: collapsedState[weekKey] ?? true
        });
      });

    setPostGroups(groups);
  }, [posts, searchQuery, currentUser, collapsedState]);

  const toggleGroup = (index: number) => {
    const group = postGroups[index];
    setCollapsedState(prev => ({
      ...prev,
      [group.title]: !group.isCollapsed
    }));
  };

  useEffect(() => {
    if (postGroups.length > 0 && Object.keys(collapsedState).length === 0) {
      const initialState: Record<string, boolean> = {};
      postGroups.forEach(group => {
        initialState[group.title] = group.title !== 'TODAY';
      });
      setCollapsedState(initialState);
    }
  }, [postGroups.length]);

  const handlePostClick = async (post: Post) => {
    if (currentUser && currentUser._id) {
      try {
        const updatedPost = await postClient.viewPost(post._id, currentUser._id);
        const readPost = await postClient.markPostAsRead(post._id);
        const updatedPosts = posts.map((p: Post) => 
          p._id === post._id ? { ...readPost, viewedBy: updatedPost.viewedBy } : p
        );
        dispatch(setPosts(updatedPosts));
        onSelectPost({ ...readPost, viewedBy: updatedPost.viewedBy });
      } catch (error) {
        console.error("Error viewing post:", error);
        onSelectPost(post);
      }
    } else {
      onSelectPost(post);
    }
  };

  return (
    <div className="post-list">
      {postGroups.map((group, index) => (
        <div key={group.title} className="post-group">
          <div 
            className="post-group-header"
            onClick={() => toggleGroup(index)}
          >
            <span className="group-toggle">
              {group.isCollapsed ? '▸' : '▾'}
            </span>
            <span className="group-title">{group.title}</span>
          </div>
          
          {!group.isCollapsed && (
            <div className="post-group-content">
              {group.posts.map((post: Post) => {
                const user = userMap[post.postBy] || { username: 'Loading...', role: 'UNKNOWN' };
                return (
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
                        <span className="post-date">
                          {new Date(post.date).toLocaleDateString('en-US', {
                            month: 'numeric',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </span>
                      </div>

                      <div className="post-preview">
                        {/* Create a temporary div to parse HTML and get text content */}
                        {(() => {
                          const tempDiv = document.createElement('div');
                          tempDiv.innerHTML = post.text;
                          // Get text content and split into lines
                          const textContent = tempDiv.textContent || tempDiv.innerText || '';
                          return textContent
                            .split('\n')
                            .slice(0, 4)
                            .map((line, index) => (
                              <div key={index} className="preview-line">
                                {line}
                              </div>
                            ));
                        })()}
                      </div>
                      
                      <div className="post-meta">
                        <span className={`post-author ${user.role === 'FACULTY' ? 'instructor' : 'student'}`}>
                          {user.username}
                          <span className="author-role">
                            {user.role}
                          </span>
                        </span>
                        {post.viewedBy && post.viewedBy.length > 0 && (
                          <span className="post-responses">
                            {post.viewedBy.length}
                          </span>
                        )}
                        {post.individualRecipients && post.postTo === "individual" && (
                          <span className="post-followups">
                            {post.individualRecipients.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 