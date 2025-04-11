import { useSelector } from 'react-redux';
import './styles.css';
import PostList from './components/PostList';
import TopNavigation from './components/TopNavigation';
import ClassGlance from './components/ClassGlance';

export default function Piazza() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  return (
    <div className="piazza-container">
      <div className="piazza-header">
        <div className="course-info">
          <h1>CS 5610-01</h1>
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
              <button className="new-post">New Post</button>
              <input type="search" placeholder="Search or add a post..." />
              <button className="show-actions">Show Actions</button>
            </div>
            <PostList />
          </div>
          
          <div className="side-panel">
            <ClassGlance />
          </div>
        </div>
      </div>
    </div>
  );
} 