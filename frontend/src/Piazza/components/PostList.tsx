import React from 'react';
import './PostList.css';

interface Post {
  id: string;
  title: string;
  type: 'note' | 'question';
  author: string;
  date: string;
  unread?: boolean;
  followups?: number;
  responses?: number;
}

export default function PostList() {
  const posts: Post[] = [
    {
      id: '1',
      title: 'JOSE OH STARTING NOW',
      type: 'note',
      author: 'Instructor',
      date: '4/9/25',
      unread: true
    },
    {
      id: '2',
      title: 'LECTURE STARTING NOW',
      type: 'note',
      author: 'Instructor',
      date: '4/9/25'
    },
    {
      id: '3',
      title: 'LECTURE VIDEO NOW AVAILABLE',
      type: 'note',
      author: 'Instructor',
      date: '4/4/25',
      followups: 2
    },
    {
      id: '4',
      title: 'HashRouter vs BrowserRouter',
      type: 'question',
      author: 'Student',
      date: '3/22/25',
      responses: 3,
      followups: 1
    },
    {
      id: '5',
      title: 'HashRouter vs BrowserRouter',
      type: 'question',
      author: 'Student',
      date: '3/22/25',
      responses: 3,
      followups: 1
    },
    {
      id: '6',
      title: 'HashRouter vs BrowserRouter',
      type: 'question',
      author: 'Student',  
      date: '3/22/25',
      responses: 3,
      followups: 1
    },
    {
      id: '7',
      title: 'HashRouter vs BrowserRouter',
      type: 'question',
      author: 'Student',  
      date: '3/22/25',
      responses: 3,
      followups: 1
    },
    {
      id: '8',
      title: 'HashRouter vs BrowserRouter',
      type: 'question',
      author: 'Student',  
      date: '3/22/25',
      responses: 3,
      followups: 1
    }
  ];

  return (
    <div className="post-list">
      {posts.map(post => (
        <div key={post.id} className={`post-item ${post.unread ? 'unread' : ''}`}>
          <div className="post-icon">
            {post.type === 'note' ? '📢' : '❓'}
          </div>
          
          <div className="post-content">
            <div className="post-header">
              <span className="post-title">{post.title}</span>
              <span className="post-date">{post.date}</span>
            </div>
            
            <div className="post-meta">
              <span className="post-author">{post.author}</span>
              {post.responses && (
                <span className="post-responses">
                  {post.responses} response{post.responses !== 1 ? 's' : ''}
                </span>
              )}
              {post.followups && (
                <span className="post-followups">
                  {post.followups} followup{post.followups !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 